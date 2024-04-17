const Sequelize = require('sequelize');
const sequelize = require('../database');
const Empresa = require('./empresa');

const Mensagem = sequelize.define('Mensagens', {
  titulo: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Campo Titulo não pode ser vazio',
      },
    },
  },
  body: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Campo Mensagem não pode ser vazio',
      },
    },
  },
  img: {
    allowNull: true,
    type: Sequelize.STRING,
  },
});

Mensagem.belongsTo(Empresa);

module.exports = Mensagem;
