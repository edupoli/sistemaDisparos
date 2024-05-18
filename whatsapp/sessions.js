const NodeCache = require('node-cache');
const {
  makeWASocket,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  isJidBroadcast,
  DisconnectReason,
} = require('@whiskeysockets/baileys');
const fs = require('fs/promises');
const Session = require('./util');
const fnSockets = require('../sockets/fnSockets');
const Apoiador = require('../database/models/apoiador');
const Contatos = require('../database/models/contatos');
const Sessions = require('../database/models/sessions');
const { getIO } = require('../sockets/init');
const mainLogger = require('./logger');
const logger = mainLogger.child({});
logger.level = 'info';
const msgRetryCounterCache = new NodeCache();

const Start = async (session, empresaId, callback) => {
  try {
    let dataInArray = Session.getSession(session);

    if (dataInArray && dataInArray.status !== 'close') {
      return callback(null, dataInArray.sock);
    }

    const { state, saveCreds } = await useMultiFileAuthState(
      `tokens/${session}`
    );
    Session.checkAddUser(session);

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
      version: version,
      msgRetryCounterCache: msgRetryCounterCache,
      mediaCache: new NodeCache(),
      userDevicesCache: new NodeCache(),
      connectTimeoutMs: 60000,
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

    const io = getIO();
    const funcoesSocket = new fnSockets(io);

    sock.ev.process(async (events) => {
      if (events['connection.update']) {
        const update = events['connection.update'];
        const { connection, lastDisconnect, qr } = update;
        console.log('Connection update:', update);

        if (connection === 'close') {
          if (
            lastDisconnect?.error?.output?.statusCode !==
            DisconnectReason.loggedOut
          ) {
            Session.addInfoSession(session, { status: 'close' });
            Start(session, empresaId, callback);
          } else {
            await fs.rm(`./tokens/${session}`, { recursive: true });
            await Sessions.destroy({ where: { nome: session } });
            Session.deleteSession(session);

            console.log('Connection closed. You are logged out.');
            callback(new Error('Connection closed. You are logged out.'));
          }
        }

        if (connection === 'open') {
          console.log('Connection opened');
          const regex = /^55(\d{10,11})/;
          const match = sock.user?.id.match(regex);
          let number = match ? match[1] : null;

          if (number && number.length === 10) {
            number = `${number.substring(0, 2)}9${number.substring(2)}`;
          }

          await Sessions.upsert({
            nome: session,
            clientID: number,
            empresaId: empresaId,
          });

          Session.addInfoSession(session, {
            sock: sock,
            status: 'open',
            phone: sock.user?.id,
          });
          callback(null, sock);
        }
        funcoesSocket.qrCode(session, { session, urlcode: qr });
      }

      if (events['creds.update']) {
        await saveCreds();
      }

      if (events['messaging-history.set']) {
        const { contacts, isLatest } = events['messaging-history.set'];
        if (isLatest) {
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
              logger.info(`Apoiador ${sock?.user?.name} já está cadastrado`);
            }

            let contactsData = contacts
              .map((c) => {
                if (c.id !== 'status@broadcast') {
                  return {
                    whatsapp: c.id,
                    nome: c.name || c.notify || 'Sem nome no WhatsApp',
                    ApoiadorId: apoiador.id,
                    empresaId,
                  };
                }
                return null;
              })
              .filter((c) => c !== null);

            await Contatos.bulkCreate(contactsData, {
              ignoreDuplicates: true,
            });
          } catch (error) {
            console.error(error);
          }
          console.log(
            `Received ${events['messaging-history.set'].contacts.length} contacts`
          );
        }
      }

      if (events['contacts.update']) {
        for (const contact of events['contacts.update']) {
          if (typeof contact.imgUrl !== 'undefined') {
            const newUrl =
              contact.imgUrl === null
                ? null
                : await sock.profilePictureUrl(contact.id).catch(() => null);
            console.log(
              `contact ${contact.id} has a new profile pic: ${newUrl}`
            );
          }
        }
      }
    });
  } catch (error) {
    callback(error);
  }
};

module.exports = Start;
