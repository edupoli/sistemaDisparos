const amqplib = require('amqplib');
const config = require('../envConfig');

let connection;

async function connect() {
  const connectionString = `amqp://${config.amqp_user}:${config.amqp_password}@${config.amqp_host}:${config.amqp_port}`;

  try {
    connection = await amqplib.connect(connectionString);
    console.log('Connected to RabbitMQ');

    connection.on('error', (err) => {
      console.error('Connection error with RabbitMQ:', err.message);
      reconnect();
    });

    connection.on('close', () => {
      console.error('Connection to RabbitMQ closed. Reconnecting...');
      reconnect();
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error.message);
    reconnect();
  }
}

function reconnect() {
  setTimeout(connect, 5000); // 5 seconds before trying to reconnect
}

module.exports = { connect };
