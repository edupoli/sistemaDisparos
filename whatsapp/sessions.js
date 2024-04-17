const NodeCache = require('node-cache');
const {
  makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  isJidBroadcast,
} = require('@whiskeysockets/baileys');
const fs = require('fs/promises');
const Session = require('./util');
const fnSockets = require('../sockets/fnSockets');
const Apoiador = require('../database/models/apoiador');
const Contatos = require('../database/models/contatos');
const Sessions = require('../database/models/sessions');
const axios = require('axios');
const { getIO } = require('../sockets/init');
const { port } = require('../envConfig');

const mainLogger = require('./logger');
const logger = mainLogger.child({});
logger.level = 'info';

const msgRetryCounterCache = new NodeCache();

// start a connection
const Start = async (session, empresaId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataInArray = Session?.getSession(session);
      console.log('dataInArray', dataInArray);
      if (!dataInArray || dataInArray.status === 'DISCONNECTED') {
        console.log('Iniciando nova sessão...');
        const { state, saveCreds } = await useMultiFileAuthState(
          `tokens/${session}`
        );
        // fetch latest version of WA Web
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

        const io = getIO();
        const funcoesSocket = new fnSockets(io);

        const sock = makeWASocket({
          version,
          msgRetryCounterCache,
          mediaCache: new NodeCache(),
          userDevicesCache: new NodeCache(),
          connectTimeoutMs: 60_000,
          defaultQueryTimeoutMs: undefined,
          logger,
          printQRInTerminal: true,
          emitOwnEvents: true,
          syncFullHistory: true,
          appStateMacVerification: { patch: true, snapshot: true },
          shouldIgnoreJid: (jid) => isJidBroadcast(jid),
          msgRetryCounterCache: this.msgRetryCounterCache,
          transactionOpts: { maxCommitRetries: 1, delayBetweenTriesMs: 10 },
          browser: ['Grafica-Valadao', 'Safari', '99.0.4844.51'],
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
          },
        });

        Session?.checkAddUser(session);

        sock.ev.process(async (events) => {
          if (events['connection.update']) {
            const update = events['connection.update'];
            const { connection, lastDisconnect, qr } = update;

            if (connection === 'close') {
              if (
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut
              ) {
                console.log('Reconnecting...');
                Session?.addInfoSession(session, {
                  status: 'DISCONNECTED',
                });
                let dataInArray = Session?.getSession(session);
                console.log('dataInArray', dataInArray);
                Start(session, empresaId, io);
              } else {
                await fs.rm(`./tokens/${session}`, { recursive: true });
                await Sessions.destroy({ where: { nome: session } });
                Session.deleteSession(session);
                console.log('Connection closed. You are logged out.');
              }
            }

            if (connection === 'open') {
              const regex = /^55(\d{10,11})/;
              const match = sock.user?.id.match(regex);
              let number = match ? match[1] : null;

              // Adiciona um '9' após os dois primeiros dígitos se o número tem exatamente 10 dígitos
              if (number && number.length === 10) {
                number = `${number.substring(0, 2)}9${number.substring(2)}`;
              }
              await Sessions.upsert({
                nome: session,
                clientID: number,
              });
              Session?.addInfoSession(session, {
                client: sock,
                status: 'CONNECTED',
                phone: sock.user?.id,
              });
              resolve(sock);
            }

            console.log('connection update', update);

            funcoesSocket.qrCode(session, {
              session: session,
              urlcode: qr,
            });
          }

          // credentials updated -- save them
          if (events['creds.update']) {
            await saveCreds();
          }

          // history received
          if (events['messaging-history.set']) {
            const { contacts } = events['messaging-history.set'];

            const match = sock.user?.id.match(/^55(\d{10,11})/);
            let number = match ? match[1] : null;

            if (number && number.length === 10) {
              number = `${number.substring(0, 2)}9${number.substring(2)}`;
            }

            try {
              let apoiador = await Apoiador.findOne({
                where: { whatsapp: number },
              });

              if (!apoiador) {
                apoiador = await Apoiador.create({
                  nome:
                    sock.user?.name ||
                    sock.user?.id ||
                    'Apoiador Sem Nome Cadastrado no WhatsApp',
                  whatsapp: number,
                  tipoApoiadorId: 1,
                  EmpresaId: empresaId,
                });
              } else {
                logger.info(`Apoiador ${sock.user?.name} já está cadastrado`);
              }

              // Preparar os contatos para bulkCreate
              let contactsData = contacts
                .map((c) => {
                  if (c.id !== 'status@broadcast') {
                    return {
                      whatsapp: c.id,
                      nome: c.name || c.notify || 'Sem nome no WhatsApp',
                      ApoiadorId: apoiador.id, // Usar o id do apoiador encontrado ou criado
                      empresaId,
                    };
                  }
                  return null;
                })
                .filter((c) => c !== null); // Remove nulls, se houver

              await Contatos.bulkCreate(contactsData, {
                updateOnDuplicate: [
                  'nome',
                  'email',
                  'cep',
                  'endereco',
                  'numero',
                  'bairro',
                  'cidade',
                  'uf',
                  'img',
                  'observacao',
                ],
              });
            } catch (error) {
              console.error(error);
            }

            console.log(`recv ${contacts.length} contacts`);
          }

          if (events['contacts.update']) {
            for (const contact of events['contacts.update']) {
              if (typeof contact.imgUrl !== 'undefined') {
                const newUrl =
                  contact.imgUrl === null
                    ? null
                    : await sock
                        .profilePictureUrl(contact.id)
                        .catch(() => null);
                console.log(
                  `contact ${contact.id} has a new profile pic: ${newUrl}`
                );
              }
            }
          }
        });
      } else {
        const data = Session?.getSession(session);
        resolve(data ? data : null);
      }
    } catch (error) {
      logger.error('Error starting session', error);
      reject(error);
    }
  });
};
exports.Start = Start;
