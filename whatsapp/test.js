const NodeCache = require('node-cache');
const {
  makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  isJidBroadcast,
} = require('@whiskeysockets/baileys');
const MAIN_LOGGER = require('./logger');

const logger = MAIN_LOGGER.child({});
logger.level = 'info';

const msgRetryCounterCache = new NodeCache();

// start a connection
const Start = async (session) => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(session);

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        /** caching makes the store faster to send/recv messages */
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    });

    sock.ev.process(
      // events is a map for event name => event data
      async (events) => {
        // something about the connection changed
        // maybe it closed, or we received all offline message or connection opened
        if (events['connection.update']) {
          const update = events['connection.update'];
          const { connection, lastDisconnect } = update;
          if (connection === 'close') {
            // reconnect if not logged out
            if (
              lastDisconnect?.error?.output?.statusCode !==
              DisconnectReason.loggedOut
            ) {
              Start(session);
            } else {
              console.log('Connection closed. You are logged out.');
            }
          }

          console.log('connection update', update);
        }

        // credentials updated -- save them
        if (events['creds.update']) {
          await saveCreds();
        }

        if (events['labels.association']) {
          console.log(events['labels.association']);
        }

        if (events['labels.edit']) {
          console.log(events['labels.edit']);
        }

        if (events.call) {
          console.log('recv call event', events.call);
        }

        // history received
        if (events['messaging-history.set']) {
          const { chats, contacts, messages, isLatest } =
            events['messaging-history.set'];
          console.log(
            `recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`
          );
        }

        // received a new message
        if (events['messages.upsert']) {
          const upsert = events['messages.upsert'];
          console.log('recv messages ', JSON.stringify(upsert, undefined, 2));
        }

        // messages updated like status delivered, message deleted etc.
        if (events['messages.update']) {
          console.log(JSON.stringify(events['messages.update'], undefined, 2));

          for (const { key, update } of events['messages.update']) {
            if (update.pollUpdates) {
              const pollCreation = await getMessage(key);
              if (pollCreation) {
                console.log(
                  'got poll update, aggregation: ',
                  getAggregateVotesInPollMessage({
                    message: pollCreation,
                    pollUpdates: update.pollUpdates,
                  })
                );
              }
            }
          }
        }

        if (events['message-receipt.update']) {
          console.log(events['message-receipt.update']);
        }

        if (events['messages.reaction']) {
          console.log(events['messages.reaction']);
        }

        if (events['presence.update']) {
          console.log(events['presence.update']);
        }

        if (events['chats.update']) {
          console.log(events['chats.update']);
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

        if (events['chats.delete']) {
          console.log('chats deleted ', events['chats.delete']);
        }
      }
    );

    return sock;
  } catch (error) {
    logger.error('Error starting session', error);
  }
};

Start('main-session').catch((err) => {
  console.error('Error starting session:', err);
});
