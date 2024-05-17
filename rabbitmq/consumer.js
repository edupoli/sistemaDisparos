const { getChannel } = require('./channel');
const { getQueue } = require('./getQueues');
const { delay } = require('@whiskeysockets/baileys');
const { getIO } = require('../sockets/init');

const processingQueues = new Set();
const activeChannels = new Map();

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
      setTimeout(async () => {
        channel.ack(msg);
        console.log('Message acknowledged');
        const queueStatics = await getQueue(queueName);
        const io = getIO();
        io.emit('messageProcessed', {
          queue: queueName,
          statics: queueStatics,
        });
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
    io.emit('startProcessing', { queue });
    processingQueues.add(queue);

    const { consumerTag } = await channel.consume(
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

    activeChannels.set(queue, { channel, consumerTag });

    return () => {
      io.emit('stopProcessing', { queue });
      processingQueues.delete(queue);
      channel.close();
      activeChannels.delete(queue);
    };
  } catch (error) {
    console.error('Failed to set up consumer:', error);
  }
};

const stopListener = async (queue) => {
  const channelInfo = activeChannels.get(queue);
  if (channelInfo) {
    await channelInfo.channel.cancel(channelInfo.consumerTag);
    console.log(`Paused consuming messages on ${queue}`);
    const io = getIO();
    io.emit('stopProcessing', { queue });
  }
};

const deleteQueue = async (queue) => {
  const channelInfo = activeChannels.get(queue);
  if (channelInfo) {
    await channelInfo.channel.close();
    activeChannels.delete(queue);
  }
  const channel = await getChannel();
  await channel.deleteQueue(queue);
  console.log(`Deleted queue ${queue}`);
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

module.exports = { listener, stopListener, deleteQueue, getProcessingQueues };
