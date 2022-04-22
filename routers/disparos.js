/*##############################################################################
# File: disparos.js                                                            #
# Project: sistema-de-disparos                                                 #
# Created Date: 2021-12-28 00:54:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-20 03:57:33                                           #
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

// essa rota é exclusiva para alimentar a tabela contatos pois a unica diferença é que possui limit para evitar travar o frontend
Router.post('/disparos/contatos', async (req, res) => {
  // esse é o que vai para a tabela contatos na tela de disparos diferença é o limit
  let contatos = await Contatos.findAll({
    where: {
      ApoiadorId: {
        [Op.eq]: req.body.ApoiadorId,
      },
    },
    limit: 80,
  });
  numeros.length = 0;
  contact.forEach((element) => {
    numeros.push({ number: element.whatsapp, sender: false });
  });

  res.send(contact);
});

// recebo a requisição da chamada da função
Router.post('/disparos/send', async (req, res) => {
  queueNewMessages(req.body.id, req.body.time, numeros, mensagem, req);
});

Router.post('/disparos/cancelarEnvio', async (req, res) => {
  await deleteQueue();
  res.redirect('/disparos');
});

module.exports = Router;
