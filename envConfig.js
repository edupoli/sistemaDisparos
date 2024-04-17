require('dotenv').config();
const env = require('env-var');

const config = {
  port: env.get('PORT').default(3800).asInt(),
  host: env.get('HOST').default('localhost').asString(),
  db_username: env.get('DB_USERNAME').default('').asString(),
  db_password: env.get('DB_PASSWORD').default('').asString(),
  db_name: env.get('DB_NAME').default('disparos').asString(),
  db_hostname: env.get('DB_HOSTNAME').default('localhost').asString(),
  db_port: env.get('DB_PORT').default(3306).asInt(),
  amqp_host: env.get('AMQP_HOST').default('localhost').asString(),
  amqp_port: env.get('AMQP_PORT').default(5672).asInt(),
  amqp_user: env.get('AMQP_USER').default('admin').asString(),
  amqp_password: env.get('AMQP_PASSWORD').default('admin').asString(),
  amqp_exchange: env.get('AMQP_EXCHANGE').default('API-WhatsApp').asString(),
};

module.exports = config;
