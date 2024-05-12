const amqplib = require('amqplib');
const config = require('./envConfig');

let connection;
let channel;
let exchangeSetup = false;
let queueCache = {};

async function init() {
  await connect();
  if (channel) {
    await prepareExchange();
  }
}

async function connect() {
  const connectionString = `amqp://${config.amqp_user}:${config.amqp_password}@${config.amqp_host}:${config.amqp_port}`;

  try {
    connection = await amqplib.connect(connectionString);
    connection.on('error', (err) => {
      console.error('Erro na conexão RabbitMQ:', err);
      connection.close();
      setTimeout(connect, 5000);
    });

    channel = await connection.createConfirmChannel();
    if (channel) {
      await prepareExchange();
    }

    channel.on('error', async (err) => {
      console.error('Erro no canal RabbitMQ:', err);
      if (channel) {
        await channel.close();
      }
      channel = await connection.createConfirmChannel();
      await prepareExchange();
    });
  } catch (error) {
    console.error(
      'Falha ao conectar ao RabbitMQ. Tentando novamente em 5 segundos...',
      error
    );
    setTimeout(connect, 5000);
  }
}

async function prepareExchange() {
  if (!channel) {
    console.error('Erro: Canal não definido!');
    return;
  }
  if (!exchangeSetup) {
    await channel.assertExchange(config.amqp_exchange, 'x-delayed-message', {
      durable: true,
      arguments: { 'x-delayed-type': 'direct' },
    });
    exchangeSetup = true;
  }
}

async function prepareQueue(queue) {
  if (!queueCache[queue]) {
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': `${queue}-dead-letter`,
      },
    });
    await channel.bindQueue(queue, config.amqp_exchange, queue);
    queueCache[queue] = true;
  }
}

async function send(payload) {
  const queue = payload.whatsapp;
  await prepareQueue(queue);

  const delay = (payload.time || 0) * 1000;
  const options = {
    headers: {
      'x-delay': delay,
    },
  };

  channel.publish(
    config.amqp_exchange,
    queue,
    Buffer.from(JSON.stringify(payload), 'utf-8'),
    options
  );

  return {
    status: 200,
    message: 'Mensagem colocada na fila de envios com sucesso!',
  };
}

const sendMessageWTyping = async (msg, jid) => {
  await sock.presenceSubscribe(jid);
  await delay(500);

  await sock.sendPresenceUpdate('composing', jid);
  await delay(2000);

  await sock.sendPresenceUpdate('paused', jid);

  await sock.sendMessage(jid, msg);
};

module.exports = {
  init,
  send,
};
