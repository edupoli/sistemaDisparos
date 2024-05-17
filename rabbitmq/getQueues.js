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
      total_publish: queue.message_stats.publish,
      total_ack: queue.message_stats.ack || 0,
      total_msgs_now: queue.messages,
    }));

    return queues;
  } catch (error) {
    console.error('Failed to fetch queue info:', error);
    throw error;
  }
}

async function getQueue(queueName) {
  const username = config.amqp_user;
  const password = config.amqp_password;
  const rabbitMqUrl = `http://${config.amqp_host}:15672`;

  try {
    const { data } = await axios.get(
      `${rabbitMqUrl}/api/queues/%2F/${queueName}`,
      {
        auth: {
          username: username,
          password: password,
        },
      }
    );

    const queue = {
      name: data.name,
      total_publish: data.message_stats.publish,
      total_ack: data.message_stats.ack || 0,
      total_msgs_now: data.messages,
    };

    return queue;
  } catch (error) {
    console.error('Failed to fetch queue info:', error);
    throw error;
  }
}

module.exports = { listQueues, getQueue };

// getQueue('43991241788').then((result) =>
//   console.log(JSON.stringify(result, null, 2))
// );
