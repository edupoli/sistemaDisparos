const { init } = require('./rabbitmq2');

const { send } = require('./rabbitmq/queueManager');

(async () => {
  const result = await send({
    whatsapp: '12345678',
    time: 60,
    data: {
      message: 'Hello, RabbitMQ!',
    },
  });
  console.log(result);
})();

const config = require('./envConfig');

function connect() {
  return require('amqplib')
    .connect(
      `amqp://${config.amqp_user}:${config.amqp_password}@${config.amqp_host}:${config.amqp_port}`
    )
    .then((conn) => conn.createChannel());
}

function createQueue(channel, queue) {
  return new Promise((resolve, reject) => {
    try {
      channel.assertQueue(queue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': `${queue}-dead-letter`,
        },
      });
      resolve(channel);
    } catch (err) {
      reject(err);
    }
  });
}

function sendToQueue(queue, message, time) {
  const delay = (time || 0) * 1000;
  const options = {
    headers: { 'x-delay': delay },
  };

  connect()
    .then((channel) => createQueue(channel, queue))
    .then((channel) =>
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message), options))
    )
    .catch((err) => console.log(err));
}

function consume(queue, callback) {
  connect()
    .then((channel) => createQueue(channel, queue))
    .then((channel) => channel.consume(queue, callback, { noAck: true }))
    .catch((err) => console.log(err));
}

module.exports = {
  sendToQueue,
  consume,
};

(async () => {
  consume('43991241788', (msg) => {
    const payload = JSON.parse(msg.content.toString());
    console.log('Received message:', payload);
  });
  await sendToQueue(
    'calcinha',
    {
      message: 'Hello, RabbitMQ!',
    },
    60
  );
})();
const { listQueues } = require('./rabbitmq/getQueues');

(async () => {
  const queues = await listQueues();
  console.log('Existing Queues:', queues);
})();
const axios = require('axios');

async function getQueues() {
  const url = 'http://hostname:15672/api/queues'; // Substitua 'hostname' pelo endereço do seu servidor RabbitMQ
  const username = 'admin'; // Usuário para autenticação
  const password = 'admin'; // Senha para autenticação

  try {
    const { data } = await axios.get(url, {
      auth: {
        username: username,
        password: password,
      },
    });

    // Processamento dos dados aqui:
    data.forEach((queue) => {
      console.log({
        name: queue.name,
        messages: queue.messages,
      });
    });
  } catch (error) {
    console.error('Erro ao acessar a API:', error.message);
    if (error.response) {
      // A propriedade response está disponível se o servidor respondeu com um status fora do intervalo 2xx
      console.error('Detalhes do erro:', error.response.data);
    }
  }
}

getQueues();



