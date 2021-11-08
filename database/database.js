const Sequelize = require('sequelize');
const confg = require('../config');

const connection = new Sequelize(
    confg.db_name,
    confg.db_username,
    confg.db_password, {
    host: confg.db_hostname,
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;