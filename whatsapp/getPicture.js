/*##############################################################################
# File: getPicture.js                                                          #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-16 15:31:57                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-18 23:56:50                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/
const Queue = require('bull');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const Sessions = require('../whatsapp/util');
const Contatos = require('../database/models/contatos');
const { Op } = require('sequelize');
let dir = path.resolve(__dirname, '..', 'public/images/contatos');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/queues');

const workQueue = new Queue('getPicture', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  limiter: {
    max: 1,
    duration: 5000,
  },
});

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(workQueue)],
  serverAdapter: serverAdapter,
});

async function savePicture(tmp_session, session, contacts) {
  const dados = {
    tmp_session: tmp_session,
    session: session,
    number: contacts,
  };
  const options = {
    delay: 600,
    attempts: 1,
  };
  workQueue.add(dados, options);
  console.log('adicionado a fila getPicture');
}

workQueue.process(async (job, done) => {
  done();
  return await getPicture(job.data);
});

async function getPicture(job) {
  let data = Sessions.getSession(job.tmp_session);

  data?.client
    ?.getProfilePicture(job?.number)
    .then((result) => {
      axios
        ?.get(result, { responseType: 'arraybuffer' })
        .then(async (result) => {
          let buffer = Buffer?.from(result?.data)?.toString('base64');
          console.log(buffer);
          await Contatos.update(
            {
              img: `data:image/jpeg;base64,${buffer}`,
            },
            {
              where: {
                whatsapp: {
                  [Op.eq]: job.number,
                },
              },
            }
          );
        });
      console.log('data base64 saved in database');
    })
    .catch(async (err) => {
      await Contatos.update(
        {
          img: 'sem_foto', //`data:image/jpeg;base64,${imgSemFoto}`,
        },
        {
          where: {
            whatsapp: {
              [Op.eq]: job.number,
            },
          },
        }
      );
      console.log('data base64 saved in database');
    });
}

exports.savePicture = savePicture;
