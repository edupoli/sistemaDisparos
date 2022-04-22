/*##############################################################################
# File: envios.js                                                              #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 14:36:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-20 12:32:53                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const Session = require('../whatsapp/util');
const Sessions = require('../database/models/sessions');
const { MessageType } = require('@adiwajshing/baileys');
const fnSockets = require('../sockets/fnSockets');
const Queue = require('bull');
const axios = require('axios');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/queues');

let queue = [];

async function makeQueue(id, time) {
  let workQueue = new Queue(`Apoiador ${id}`, {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    limiter: {
      max: 1,
      duration: parseInt(time),
    },
  });
  queue.push(workQueue);
  return workQueue;
}

async function queueNewMessages(id, time, numeros, mensagem, req) {
  const funcoesSocket = new fnSockets(req.io);
  let workQueue = await makeQueue(id, time);

  const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullAdapter(workQueue)],
    serverAdapter: serverAdapter,
  });

  async function getActiveSessions() {
    return new Promise(async (resolve, reject) => {
      let instancias = await Sessions.findAll();
      let sessions = [];
      for (let i = 0; i < instancias.length; i++) {
        let result = await axios({
          method: 'post',
          url: `http://localhost:3000/v1/start/${instancias[i].nome}/1`,
        });
        if (result.data.status === 'CONNECTED') {
          sessions.push({ nome: instancias[i].nome });
        }
      }
      resolve(sessions);
    });
  }

  async function startSessions() {
    let sessions = await getActiveSessions();
    let x = 0;
    let y = 0;
    let z = Math.ceil(numeros.length / sessions.length);
    let w = Math.ceil(numeros.length / sessions.length);

    do {
      do {
        putQueue(sessions[x].nome, numeros[y].number, mensagem);

        y++;
        if (y == numeros.length) {
          z--;
        }
      } while (y < z);
      z += w;

      x++;
    } while (x != sessions.length);

    req.io.emit('queue', {
      qtda: numeros.length,
      percent: numeros.length / 100,
      qtd_Sessoes: sessions.length,
      qtda_Msg_Por_Sessao: Math.ceil(numeros.length / sessions.length),
    });
  }
  startSessions();
  // recebo a requisição da chamada da função
  function putQueue(session, phone, message) {
    const data = {
      session: session,
      phone: phone,
      message: message[0].body,
    };

    const options = {
      delay: 600, // 1 min in ms
      attempts: 1,
    };
    // adiciona a fila
    workQueue.add(data, options);
    console.log('adiciona a fila');
  }

  // processa a fila chamando a função send
  workQueue.process(async (job, done) => {
    console.log(job.data);
    done();
    return await send(job.data);
  });

  // essa aqui e a função que a fila processa
  async function send(dados) {
    let data = Session.getSession(dados.session);
    const result = await data?.client?.sendMessage(
      dados?.phone,
      dados?.message,
      MessageType.text
    );
    console.log(result);
  }

  workQueue.on('completed', async (job, result) => {
    console.log(`Job ${job.id} completed ${JSON.stringify(result)}`);
    req.io.emit('completed', { job: job.id });
  });

  workQueue.getCompletedCount().then((result) => {
    console.log(result);
  });

  workQueue.on('progress', function (job, progress) {
    console.log(`Job ${job.id} is ${progress * 100}% ready!`);
  });

  workQueue.on('global:progress', function (jobId, progress) {
    console.log(`Job ${jobId} is ${progress * 100}% ready!`);
  });
}

async function deleteQueue() {
  await queue[0].obliterate();
}

exports.queueNewMessages = queueNewMessages;
exports.serverAdapter = serverAdapter;
exports.deleteQueue = deleteQueue;
