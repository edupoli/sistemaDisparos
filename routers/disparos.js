/*##############################################################################
# File: disparos.js                                                            #
# Project: sistema-de-disparos                                                 #
# Created Date: 2021-12-28 00:54:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-06-14 19:09:48                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const Mensagem = require('../database/models/mensagem');
const Empresa = require('../database/models/empresa');
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const Sessions = require('../database/models/sessions');
const tipoApoiador = require('../database/models/tipoApoiador');
const { Op } = require('sequelize');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');
const path = require('path');
const fs = require('fs');
const { sendToQueue } = require('../rabbitmq/queueManager');
const { listQueues } = require('../rabbitmq/getQueues');
const { getQueueMessages } = require('../rabbitmq/getMessage');
const Start = require('../whatsapp/sessions');
const {
  listener,
  stopListener,
  getProcessingQueues,
} = require('../rabbitmq/consumer');

var numeros = [];
var mensagem;

Router.get('/disparos', isLogged, adminAuth, async (req, res) => {
  let mgs = await Mensagem.findAll();
  let empresas = await Empresa.findAll();
  let contatos = await Contatos.findAll();
  let apoiadores = await Apoiador.findAll();
  let tipo = await tipoApoiador.findAll();
  res.render('disparos/disparos', {
    usuario: res.locals.user,
    error: req.flash('error'),
    success: req.flash('success'),
    empresa: empresas,
    contato: contatos,
    apoiador: apoiadores,
    mensagem: mgs,
    tipo: tipo,
  });
});

Router.post('/disparos/apoiador', async (req, res) => {
  let apoiadors = await Apoiador.findAll({
    where: {
      [Op.and]: [
        { EmpresaId: req.body.EmpresaId },
        { tipoApoiadorId: req.body.tipoApoiadorId },
      ],
    },
  });
  res.send(apoiadors);
});

Router.post('/disparos/mensagens', async (req, res) => {
  var msg = await Mensagem.findAll({
    where: {
      id: {
        [Op.eq]: req.body.id,
      },
    },
  });
  res.send(msg);
  mensagem = msg;
});

Router.post('/disparos/contatos', async (req, res) => {
  const limit = req.body.length ? parseInt(req.body.length, 10) : 10; // Pega o valor 'length' enviado pelo DataTables ou um padrão
  const offset = req.body.start ? parseInt(req.body.start, 10) : 0; // Pega o valor 'start' enviado pelo DataTables ou zero

  let contatos = await Contatos.findAndCountAll({
    where: {
      ApoiadorId: req.body.ApoiadorId,
    },
    limit: limit,
    offset: offset,
  });

  // Estrutura de dados esperada pelo DataTables
  res.json({
    recordsTotal: contatos.count,
    recordsFiltered: contatos.count,
    data: contatos.rows,
  });
});

// recebo os dados selecionados no front-end e faz a requisição de envio
Router.post('/disparos/createQueue', async (req, res) => {
  let contacts = await Contatos.findAll({
    where: {
      ApoiadorId: {
        [Op.eq]: req.body.ApoiadorId,
      },
    },
  });

  const apoiadorData = await Apoiador.findByPk(req.body.ApoiadorId);
  if (!apoiadorData) {
    return res.status(404).json({ error: 'Apoiador não encontrado.' });
  }

  const sessionData = await Sessions.findOne({
    where: { clientID: apoiadorData.whatsapp },
  });

  const tokenPath = path.join(__dirname, '..', `tokens/${sessionData.nome}`);

  if (!fs.existsSync(tokenPath)) {
    return res.status(404).json({
      error:
        'Não existe sessão ATIVA para o apoiador selecionado. Favor entrar em contato com o Apoiador e solicitar para fazer nova leitura do QRCode ',
    });
  }
  //const sock = await Start(sessionData.nome, sessionData.EmpresaId);

  for (const contact of contacts) {
    await sendToQueue(
      apoiadorData.whatsapp,
      {
        apoiador: apoiadorData.nome,
        empresa: req.body.nomeEmpresa,
        whatsapp: apoiadorData.whatsapp,
        contact: contact.whatsapp,
        qtda_contatos: contacts.length,
        mensage: mensagem[0].body,
        time: req.body.time,
      },
      req.body.time
    );
  }
  //console.log(sock);
  res.json({ message: 'Fila iniciada com sucesso.' });
});

Router.post('/disparos/cancelarEnvio', async (req, res) => {
  //await deleteQueue();
  res.redirect('/disparos');
});

Router.get('/disparos/list', isLogged, adminAuth, async (req, res) => {
  try {
    let queues = await listQueues();
    let data = [];
    if (queues.length > 0) {
      const dataPromises = queues.map(async (queue) => {
        const msgQueue = (await getQueueMessages(queue.name)) || {};
        return {
          fila: queue.name,
          qtda_msgs: `0 de ${queue.messages}`, // Inicializa com o formato "0 de total"
          apoiador: msgQueue.apoiador || '',
          empresa: msgQueue.empresa || '',
          whatsapp: msgQueue.whatsapp || '',
          session: msgQueue.session || '',
          qtda_contatos: msgQueue.qtda_contatos || 0,
          mensage: msgQueue.mensage || '',
          time: msgQueue.time || '',
        };
      });
      data = await Promise.all(dataPromises);
    }

    res.render('disparos/list', {
      usuario: res.locals.user,
      error: req.flash('error'),
      success: req.flash('success'),
      data: data,
    });
  } catch (error) {
    console.error('Failed to load data:', error);
    res.status(500).send('Server Error');
  }
});

Router.post('/disparos/processQueue', async (req, res) => {
  const { selectedData } = req.body;

  try {
    const result = selectedData.map(async (item) => {
      const session = await Sessions.findOne({
        where: { clientID: item.whatsapp_apoiador },
        raw: true,
      });

      const socket = await Start(session.nome, session.empresaId);

      listener(session.clientID, socket, item.time);
    });
    const done = await Promise.all(result);

    res.status(200).json(done);
  } catch (error) {
    console.error('Erro ao processar a fila:', error);
    res.status(500).json({ error: 'Erro ao processar a fila' });
  }
});

Router.get('/processingQueues', (req, res) => {
  res.json({ processingQueues: getProcessingQueues() });
});

Router.post('/disparos/stopQueue', async (req, res) => {
  const { queue } = req.body;

  try {
    await stopListener(queue);
    res.status(200).json({ message: 'Queue stopped successfully' });
  } catch (error) {
    console.error('Erro ao parar a fila:', error);
    res.status(500).json({ error: 'Erro ao parar a fila' });
  }
});

module.exports = Router;
