const Sequelize = require('sequelize');
const confg = require('../config');

const connection = new Sequelize(
  confg.db_name,
  confg.db_username,
  confg.db_password,
  {
    timezone: '-03:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    host: confg.db_hostname,
    port: '3306',

    logging: false,
    pool: {
      maxConnections: 20,
      maxIdleTime: 130000,
    },
    dialect: 'mysql',
  }
);

module.exports = connection;
