require('dotenv').config();
const env = require('env-var');

const config = {
  port: env.get('PORT').asInt(),
  host: env.get('HOST').asString(),
  db_username: env.get('DB_USERNAME').asString(),
  db_password: env.get('DB_PASSWORD').asString(),
  db_name: env.get('DB_NAME').asString(),
  db_hostname: env.get('DB_HOSTNAME').asString(),
  db_port: env.get('DB_PORT').asInt(),
  amqp_host: env.get('AMQP_HOST').asString(),
  amqp_port: env.get('AMQP_PORT').asInt(),
  amqp_user: env.get('AMQP_USER').asString(),
  amqp_password: env.get('AMQP_PASSWORD').asString(),
  amqp_exchange: env.get('AMQP_EXCHANGE').asString(),
};

module.exports = config;
