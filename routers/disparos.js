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
const { Op, where } = require('sequelize');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');
const path = require('path');
const fs = require('fs');
const { port } = require('../envConfig');
const { send } = require('../rabbitmq');
const { Start } = require('../whatsapp/sessions');
const { queueNewMessages, deleteQueue } = require('../whatsapp/envios');

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
    //config: config
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
  //console.log(apoiadors);
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

// essa rota é exclusiva para alimentar a tabela contatos pois a unica diferença é que possui limit para evitar travar o frontend
// Router.post('/disparos/contatos', async (req, res) => {
//   // esse é o que vai para a tabela contatos na tela de disparos diferença é o limit
//   let contatos = await Contatos.findAll({
//     where: {
//       ApoiadorId: {
//         [Op.eq]: req.body.ApoiadorId,
//       },
//     },
//     limit: 80,
//   });

//   let contact = await Contatos.findAll({
//     where: {
//       ApoiadorId: {
//         [Op.eq]: req.body.ApoiadorId,
//       },
//     },
//   });
//   numeros.length = 0;
//   contact.forEach((element) => {
//     numeros.push({ number: element.whatsapp, sender: false });
//   });

//   res.send(contatos);
// });

// recebo os dados selecionados no front-end e faz a requisição de envio
Router.post('/disparos/send', async (req, res) => {
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
  console.log(apoiadorData.whatsapp);
  const sessionData = await Sessions.findOne({
    where: { clientID: apoiadorData.whatsapp },
  });
  console.log(sessionData);
  const tokenPath = path.join(__dirname, '..', `tokens/${sessionData.nome}`);
  console.log(tokenPath);
  if (!fs.existsSync(tokenPath)) {
    return res.status(404).json({
      error:
        'Não existe sessão ATIVA para o apoiador selecionado. Favor entrar em contato com o Apoiador e solicitar para fazer nova leitura do QRCode ',
    });
  }

  const sock = await Start(sessionData.nome, sessionData.EmpresaId);
  console.log(sock);
  res.json({ message: 'Sessão iniciada com sucesso.' });
});

Router.post('/disparos/cancelarEnvio', async (req, res) => {
  //await deleteQueue();
  res.redirect('/disparos');
});

module.exports = Router;
