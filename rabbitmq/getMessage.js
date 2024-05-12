/**
 * eu consegui obter todas as filas existentes com as qtd de mensagens
 * precisa agora obter a mensagem , para com os dados criar uma tela paara listar
 * todas as filas criadas, e nessa tela irei colocar botoes de acoes para filas
 * como enviar, parar, deletar, etc.
 * quero obter o conteudo da mensagem da fila para poder apresentar na listagem de filas
 * dados que ajudem a identificar melhor a fila
 */

const axios = require('axios');
const config = require('../envConfig');

async function getQueueMessages(queueName) {
  const rabbitMqUrl = `http://${config.amqp_host}:15672`;
  const url = `${rabbitMqUrl}/api/queues/%2F/${encodeURIComponent(
    queueName
  )}/get`;

  const axiosConfig = {
    auth: {
      username: config.amqp_user,
      password: config.amqp_password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const requestData = {
    count: 1,
    ackmode: 'ack_requeue_true',
    encoding: 'auto',
    truncate: 50000,
  };

  try {
    const response = await axios.post(url, requestData, axiosConfig);
    if (response.data && response.data.length > 0 && response.data[0].payload) {
      return JSON.parse(response.data[0].payload);
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { getQueueMessages };
