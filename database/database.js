const Sequelize = require('sequelize');
const config = require('../config');
const mysql = require('mysql2/promise');

async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: config.db_hostname,
      port: config.db_port,
      user: config.username,
      password: config.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`
    );
    await connection.end();
  } catch (error) {
    console.error('Não foi possível criar o banco de dados:', error);
    process.exit(1);
  }
}

const connection = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    timezone: config.timezone,
    pool: config.pool,
  }
);

(async () => {
  await ensureDatabaseExists();
  await connection.authenticate();
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
})();

module.exports = connection;
