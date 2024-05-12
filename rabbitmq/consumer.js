const { getChannel } = require('./channel');

const processMessage = (msg, channel, delay) => {
  return new Promise((resolve) => {
    if (!msg) {
      resolve();
      return;
    }
    const content = JSON.parse(msg.content.toString());
    console.log('Processing message:', content);

    setTimeout(() => {
      channel.ack(msg);
      console.log('Message acknowledged');
      resolve();
    }, delay);
  });
};

const listener = async (queue, time) => {
  try {
    const channel = await getChannel();
    let msgCount = (await channel.checkQueue(queue)).messageCount;
    await channel.prefetch(1);
    console.log(`Listening for messages on ${queue}...`);

    channel.consume(
      queue,
      (msg) => {
        processMessage(msg, channel, time).catch((err) => {
          console.error('Failed to process message:', err);
          channel.nack(msg, false, false);
        });
        msgCount--;
        console.log(msgCount);
      },
      { noAck: false }
    );
  } catch (error) {
    console.error('Failed to set up consumer:', error);
  }
};

const sendMessage = async () => {};

const apoiadorData = await Apoiador.findByPk(req.body.ApoiadorId);
if (!apoiadorData) {
  return res.status(404).json({ error: 'Apoiador não encontrado.' });
}

const sessionData = await Sessions.findOne({
  where: { clientID: apoiadorData.whatsapp },
});

const sendMessageWTyping = async (msg, jid) => {
  await sock.presenceSubscribe(jid);
  await delay(500);

  await sock.sendPresenceUpdate('composing', jid);
  await delay(2000);

  await sock.sendPresenceUpdate('paused', jid);

  await sock.sendMessage(jid, msg);
};

module.exports = { listener, sendMessage };
