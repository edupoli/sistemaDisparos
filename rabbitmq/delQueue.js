const axios = require('axios');
const config = require('../envConfig');

async function deleteQueue(queueName) {
  const username = config.amqp_user;
  const password = config.amqp_password;
  const rabbitMqUrl = `http://${config.amqp_host}:15672`;

  try {
    const { data } = await axios.delete(
      `${rabbitMqUrl}/api/queues/%2F/${queueName}`,
      {
        auth: {
          username: username,
          password: password,
        },
      }
    );
    console.log(`Queue ${queueName} deleted successfully`);
    return data;
  } catch (error) {
    console.error('Failed to fetch queue info:', error);
    throw error;
  }
}

module.exports = { deleteQueue };
