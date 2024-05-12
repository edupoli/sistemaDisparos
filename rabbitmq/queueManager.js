const { getChannel } = require('./channel');
let queueCache = {};
let channelSingleton;

async function getOrCreateChannel() {
  if (!channelSingleton) {
    channelSingleton = await getChannel();
    channelSingleton.on('close', () => {
      console.log('Channel closed');
      channelSingleton = null;
    });
    channelSingleton.on('error', (err) => {
      console.error('Channel error:', err);
      channelSingleton = null;
    });
  }
  return channelSingleton;
}

async function prepareQueue(queue) {
  const ch = await getOrCreateChannel();
  if (!queueCache[queue]) {
    await ch.assertQueue(queue, {
      durable: true,
    });
    queueCache[queue] = true;
    console.log(`Queue ${queue} prepared`);
  }
}

async function sendToQueue(queue, message, time = 0) {
  try {
    const ch = await getOrCreateChannel();
    await prepareQueue(queue);
    const delay = time * 1000;
    const options = {
      headers: { 'x-delay': delay },
    };
    ch.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message), 'utf-8'),
      options
    );
  } catch (err) {
    console.error('Failed to send to queue:', err);
  }
}

module.exports = { prepareQueue, sendToQueue };
