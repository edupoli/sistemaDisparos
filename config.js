// config/config.js
const config = require('./envConfig');

module.exports = {
  username: config.db_username,
  password: config.db_password,
  database: config.db_name,
  host: config.db_hostname,
  port: config.db_port,
  dialect: 'mysql',
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
  timezone: '-03:00',
  pool: {
    maxConnections: 20,
    maxIdleTime: 130000,
  },
};
