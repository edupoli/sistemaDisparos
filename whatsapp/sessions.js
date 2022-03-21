/*##############################################################################
# File: sessions.js                                                            #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 13:07:33                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-20 22:26:35                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const {
  WAConnection,
  ReconnectMode,
  waChatKey,
  MessageType,
} = require('@adiwajshing/baileys');
const Session = require('./util');
const fnSockets = require('../sockets/fnSockets');
const Apoiador = require('../database/models/apoiador');
const Contatos = require('../database/models/contatos');
const Sessions = require('../database/models/sessions');
const { Op } = require('sequelize');
const { logger } = require('../logger');
const { savePicture } = require('../whatsapp/getPicture');

async function Start(req, res) {
  try {
    const { session, empresaId } = req.params;

    let dataInArray = Session?.getSession(session);

    if (!dataInArray || dataInArray.status === 'DISCONNECTED') {
      const conn = new WAConnection();
      conn.version = [3, 3234, 9];
      conn.connectOptions.maxIdleTimeMs = 10000;
      //conn.autoReconnect = ReconnectMode.onAllErrors;
      conn.connectOptions.maxRetries = 3;
      //conn.connectOptions.connectCooldownMs = 400;
      //conn.connectOptions.maxQueryResponseTime = 15;
      conn.connectOptions.logQR = true;
      //conn.chatOrderingKey = waChatKey(true);
      conn.logger.level = 'info';
      //conn.setMaxListeners(0);

      Session?.checkAddUser(session);
      Session?.addInfoSession(session, {
        status: 'STARTING',
      });

      conn.browserDescription = ['Grafica-Valadao', 'Safari', '99.0.4844.51'];
      const funcoesSocket = new fnSockets(req.io);

      let data = await Sessions.findAll({
        where: {
          nome: {
            [Op.eq]: session,
          },
        },
      });

      if (data.length > 0) {
        let authData = {
          clientID: data[0].dataValues?.clientID,
          serverToken: data[0].dataValues?.serverToken,
          clientToken: data[0].dataValues?.clientToken,
          encKey: data[0].dataValues?.encKey,
          macKey: data[0].dataValues?.macKey,
        };
        conn.loadAuthInfo(authData);
      }

      conn.on('qr', async (qr) => {
        funcoesSocket.qrCode(session, {
          session: session,
          urlcode: qr,
        });
      });

      conn.on('close', async ({ reason }) => {
        if (reason == 'invalid_session' || reason == 'bad_session') {
          logger.info(`Session ${session} delete because is invalid`);
          Session.deleteSessionDB(`${conn.user?.jid}`);
          Session.deleteSession(session);
          res?.status(200)?.json({
            result: false,
            status: 'DISCONNECTED',
          });
        } else if (reason !== 'invalid_session' || reason !== 'bad_session') {
          res?.status(200)?.json({
            result: false,
            status: 'DISCONNECTED',
          });
        }
        // res?.status(200)?.json({
        //   result: false,
        //   status: 'DISCONNECTED',
        // });
        //reason == 'timed out'
      });

      // Metodo é chamado assim que as credenciais forem atualizadas
      conn.on('open', async () => {
        const authInfo = conn.base64EncodedAuthInfo();
        await Sessions.update(
          {
            nome: conn.user?.jid,
            clientID: authInfo?.clientID,
            serverToken: authInfo?.serverToken,
            clientToken: authInfo?.clientToken,
            encKey: authInfo?.encKey,
            macKey: authInfo?.macKey,
          },
          {
            where: {
              nome: {
                [Op.eq]: conn.user?.jid,
              },
            },
          }
        );
        console.log(authInfo);
      });

      /** quando os contatos são enviados por WA */
      conn.on('contacts-received', () => {
        var contacts = [];
        contacts.push({
          patrocinador: conn.user?.name,
          nome: conn.user?.name,
          telefone: conn.user?.jid,
          whatsapp: conn.user?.jid,
          empresaId: empresaId,
        });

        Object.values(conn.contacts).forEach(
          ({ jid, name, vname, notify, short }) => {
            if (jid != 'status@broadcast') {
              contacts.push({
                whatsapp: jid, //.split('@')[0],
                nome:
                  name || vname || notify || short || 'Sem nome no WhatsApp',
                apoiador: conn.user?.jid,
              });
            }
          }
        );
        Apoiador.findAll({
          where: {
            whatsapp: {
              [Op.eq]: contacts[0].telefone,
            },
          },
        })
          .then(async (result) => {
            if (result.length == 0) {
              await Apoiador.create({
                nome: conn.user?.name,
                whatsapp: conn.user?.jid,
                tipoApoiadorId: 1, // SETA POR PADRÃO TIPO 1 AMIGOS
                EmpresaId: contacts[0].empresaId,
              }).then((result) => {
                contacts.forEach(async (item) => {
                  await Contatos.create({
                    whatsapp: item.whatsapp,
                    nome: item.nome,
                    apoiador: item.apoiador,
                    ApoiadorId: result.id,
                  });
                  //savePicture(session, conn.user?.jid, jid);
                });
                conn.close();
              });
            } else {
              logger.info(`Apoiador ${conn.user.name} ja esta cadastrado`);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });

      logger.info('hello ' + conn.user?.name + ' (' + conn.user?.jid + ')');

      await conn
        .connect()
        .then(async () => {
          const authInfo = conn.base64EncodedAuthInfo();
          let dataInDB = await Sessions.findAll({
            where: { nome: { [Op.eq]: conn.user?.jid } },
          });
          if (dataInDB.length == 0) {
            await Sessions.create({
              nome: conn.user?.jid,
              clientID: authInfo?.clientID,
              serverToken: authInfo?.serverToken,
              clientToken: authInfo?.clientToken,
              encKey: authInfo?.encKey,
              macKey: authInfo?.macKey,
            });
            console.log({
              result: 200,
              status: 'CONNECTED',
              response: `Sessão ${conn?.user?.jid} gravada com sucesso no MySQL`,
            });
          } else {
            await Sessions.update(
              {
                nome: conn.user?.jid,
                clientID: authInfo?.clientID,
                serverToken: authInfo?.serverToken,
                clientToken: authInfo?.clientToken,
                encKey: authInfo?.encKey,
                macKey: authInfo?.macKey,
              },
              {
                where: {
                  nome: {
                    [Op.eq]: conn.user?.jid,
                  },
                },
              }
            );
            console.log({
              result: 200,
              status: 'CONNECTED',
              response: `Sessão ${conn?.user?.jid} Atualizada com sucesso no MySQL`,
            });
          }

          Session?.addInfoSession(session, {
            client: conn,
            status: 'CONNECTED',
            phone: conn.user?.jid,
          });
          res?.status(200)?.json({
            result: true,
            status: 'CONNECTED',
          });
        })
        .catch(async (err) => {
          logger.error(err);
        });
    } else {
      res?.status(200)?.json({
        result: true,
        status: 'CONNECTED',
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

exports.Start = Start;
