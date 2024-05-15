const { getChannel } = require('./channel');
const { delay } = require('@whiskeysockets/baileys');
const { getIO } = require('../sockets/init');

const processingQueues = new Set();

const processMessage = async (msg, channel, sock, queueName, delay) => {
  return new Promise(async (resolve, reject) => {
    if (!msg) {
      resolve();
      return;
    }

    try {
      const content = JSON.parse(msg.content.toString());
      console.log('Processing message:', content);

      await sendMessageWTyping(sock, content.mensage, content.contact);
      setTimeout(() => {
        channel.ack(msg);
        console.log('Message acknowledged');
        const io = getIO();
        io.emit('messageProcessed', { queue: queueName });
        resolve();
      }, delay);
    } catch (error) {
      console.error('Failed to process message:', error);
      channel.nack(msg, false, true); // Requeue the message
      reject();
    }
  });
};

const listener = async (queue, sock, time) => {
  try {
    const channel = await getChannel();
    let { messageCount } = await channel.checkQueue(queue);
    await channel.prefetch(1);
    console.log(
      `Listening for messages on ${queue} with ${messageCount} messages...`
    );

    const io = getIO();
    io.emit('queueStatus', { queue, messageCount });
    io.emit('startProcessing', { queue });
    processingQueues.add(queue);

    channel.consume(
      queue,
      async (msg) => {
        await processMessage(msg, channel, sock, queue, time);
        messageCount--;
        if (messageCount === 0) {
          io.emit('stopProcessing', { queue });
          processingQueues.delete(queue);
        }
      },
      { noAck: false }
    );

    return () => {
      io.emit('stopProcessing', { queue });
      processingQueues.delete(queue);
      channel.close();
    };
  } catch (error) {
    console.error('Failed to set up consumer:', error);
  }
};

const stopListener = async (queue) => {
  if (processingQueues[queue]) {
    delete processingQueues[queue];
    const io = getIO();
    io.emit('stopProcessing', { queue });
    console.log(`Stopped processing queue: ${queue}`);
  }
};

const getProcessingQueues = () => {
  return Array.from(processingQueues);
};

const sendMessageWTyping = async (sock, msg, jid) => {
  try {
    await sock.presenceSubscribe(jid);
    await delay(500);

    await sock.sendPresenceUpdate('composing', jid);
    await delay(2000);

    await sock.sendPresenceUpdate('paused', jid);
    console.log(jid, msg);
    await sock.sendMessage(jid, { text: msg });
  } catch (error) {
    throw error;
  }
};

module.exports = { listener, stopListener, getProcessingQueues };
