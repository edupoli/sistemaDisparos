const axios = require('axios');
const config = require('../envConfig');

async function listQueues() {
  const username = config.amqp_user;
  const password = config.amqp_password;
  const rabbitMqUrl = `http://${config.amqp_host}:15672`;

  try {
    const { data } = await axios.get(`${rabbitMqUrl}/api/queues`, {
      auth: {
        username: username,
        password: password,
      },
    });

    const queues = data.map((queue) => ({
      name: queue.name,
      messages: queue.messages,
    }));

    return queues;
  } catch (error) {
    console.error('Failed to fetch queue info:', error);
    throw error;
  }
}

module.exports = { listQueues };
