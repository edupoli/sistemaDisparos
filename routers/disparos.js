/*##############################################################################
# File: disparos.js                                                            #
# Project: template-sistema                                                    #
# Created Date: 2021-12-28 00:54:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-02-21 01:12:59                                           #
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
const request = require('request-promise');
const config = require('../config');
const axios = require('axios');

var numeros = [];
let sessoes = [];
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
  let contact = await Contatos.findAll({
    where: {
      ApoiadorId: {
        [Op.eq]: req.body.ApoiadorId,
      },
    },
  });

  contact.forEach((element) => {
    numeros.push({ number: element.whatsapp, sender: false });
  });

  res.send(contact);
});

const workQueue = new Queue('mkAuth', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  limiter: {
    max: 1, // => nesse exemplo maximo de um job por 10s é executado na fila
    duration: 10000,
  },
});

// recebo a requisição da chamada da função
Router.post('/disparos/send', async (req, res) => {
  await startSessions();
  console.log(sessoes);
});

async function putQueue(sessoes, numeros, mensagem) {
  let qtd_Sessoes = sessoes.length;
  let qtd_contatos = numeros.length;
  let qtda_Msg_Por_Sessao = Math.ceil(qtd_contatos / qtd_Sessoes);

  console.log('\n');
  console.log('TOTAL DE SESSÕES: ', qtd_Sessoes);
  console.log('TOTAL DE CONTATOS: ', qtd_contatos);
  console.log('QUANTIDADE DE MENSAGENS POR SESSAO: ', qtda_Msg_Por_Sessao);
  console.log('\n');

  let x = 0;
  let y = 0;
  let controle_y = qtda_Msg_Por_Sessao;

  do {
    console.log('Init sessao: ', sessoes[x].name);

    do {
      const data = {
        session: sessoes[x].name,
        to: numeros[y].number,
        type: 'text',
        recipient_type: 'individual',
        text: {
          body: mensagem[0].body,
        },
      };

      const options = {
        delay: 600, // 1 min in ms
        attempts: 1,
      };
      // adiciona a fila
      workQueue.add(data, options);

      y++;
      if (y == qtd_contatos) {
        controle_y = controle_y - 1;
      }
    } while (y < controle_y);
    controle_y += qtda_Msg_Por_Sessao;

    x++;
  } while (x != qtd_Sessoes);

  console.log('adiciona a fila');
  numeros.length = 0;
}

// essa aqui e a função que a fila processa
async function mkAuth(dados) {
  console.log(dados);
  // var data = JSON.stringify({
  //   session: 'nome_da_sessao',
  //   number: 'Número do Destinatário',
  //   text: 'Texto para envio da mensagem',
  // });
  // var config = {
  //   method: 'post',
  //   url: 'API_URL/sendText',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     sessionkey: 'SESSIONKEY',
  //   },
  //   data: data,
  // };
  // axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
}

Router.post('/cancelarEnvio', async (req, res) => {
  await workQueue.obliterate();
  res.send('cancelado a fila');
});

// processa a fila chamando a função mkautk
workQueue.process(async (job, done) => {
  console.log('aquiiii job.data', JSON.stringify(job.data));
  done();
  return mkAuth(job.data);
});

// Router.get('/disparos/dados', async (req, res) => {
//   res.send(numeros);
//   await startSessions();
//   console.log(sessoes);
// });

async function getSessions() {
  let result = await axios({
    method: 'post',
    url: `${config.api_url}/v1/getAllSessions`,
  });

  return result.data;
}

async function startSessions() {
  // axios({
  //   method: 'post',
  //   url: `${config.api_url}/v1/getSessions`,
  // }).then((result) => {
  //   console.log(result);
  // });

  let result = await getSessions();
  console.log(result);
  result.dados.forEach((item) => {
    var options = {
      method: 'POST',
      rejectUnauthorized: false,
      json: true,
      url: `${config.api_url}/v1/start`,
      headers: {
        sessionkey: item.session,
        authorization: item.authorization,
      },
      body: {
        session: item.id,
        authorization: item.authorization,
        sessionkey: item.sessionkey,
        wh_messages: item.wh_messages,
        wh_connect: item.wh_connect,
        wh_contacts: item.wh_contacts,
        wh_qrcode: item.wh_qrcode,
        wh_status: item.wh_status,
      },
    };
    request(options)
      .then((result) => {
        console.log(result);
        if (result.wh_message == 'CONNECTED') {
          r;
        }
        // result.dados.map((item) => {
        //   if (item.session !== undefined && item.session !== '') {
        //     sessoes.push({ name: item.session });
        //   }
        //});

        return result.sessions;
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

module.exports = Router;
