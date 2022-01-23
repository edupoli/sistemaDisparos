/*##############################################################################
# File: disparos.js                                                            #
# Project: template-sistema                                                    #
# Created Date: 2021-12-28 00:54:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-01-23 02:38:56                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const Mensagem = require('../database/models/mensagem');
const Empresa = require('../database/models/empresa');
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const tipoApoiador = require('../database/models/tipoApoiador');
const { Op } = require('sequelize');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');
const Queue = require('bull');

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
  let msg = await Mensagem.findAll({
    where: {
      id: {
        [Op.eq]: req.body.id,
      },
    },
  });
  res.send(msg);
  //console.log(msg);
});

Router.post('/disparos/contatos', async (req, res) => {
  let contact = await Contatos.findAll({
    where: {
      ApoiadorId: {
        [Op.eq]: req.body.ApoiadorId,
      },
    },
  });
  res.send(contact);
  console.log(contact.length);
});

Router.get('/start/:enpresaId', (req, res) => {
  res.render('start', { empresaId: req.params.enpresaId });
});

const workQueue = new Queue('mkAuth', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  limiter: {
    max: 1, // => nesse exemplo maximo de um job por 15s é executado na fila
    duration: 15000,
  },
});

// recebo a requisição da chamada da função
Router.post('/disparos/send', async (req, res) => {
  const data = {
    token: req.body.token,
    celular: req.body.celular,
    mensagem: req.body.mensagem,
  };

  const options = {
    delay: 600, // 1 min in ms
    attempts: 1,
  };
  // adiciona a fila
  workQueue.add(data, options);
  res.send('adiciona a fila');
});

// processa a fila chamando a função mkautk
workQueue.process(async (job, done) => {
  done();
  return await mkAuth(job.data);
});

// essa aqui e a função que a fila processa
async function mkAuth(dados) {
  console.log(dados);
  let data = Sessions.getSession(dados.token);
  let number = verifica(dados.celular);
  if (!dados.mensagem) {
    console.log({
      status: 400,
      error: 'Text nao foi informado',
    });
  } else {
    try {
      let response = await data.client.sendText(number, dados.mensagem);
      return {
        result: 200,
        type: 'text',
        session: dados.token,
        messageId: response.id,
        from: response.from.split('@')[0],
        to: response.chatId.user,
        content: response.content,
      };
    } catch (error) {
      return {
        result: 500,
        error: error,
      };
    }
  }
}

Router.post('/cancelarEnvio', async (req, res) => {
  await workQueue.obliterate();
  res.send('cancelado a fila');
});

// processa a fila chamando a função mkautk
workQueue.process(async (job, done) => {
  console.log('aquiiii job.data', job.data);
  done();
  return mkAuth(job.data);
});

module.exports = Router;
