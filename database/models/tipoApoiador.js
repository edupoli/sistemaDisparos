const Sequelize = require('sequelize');
const sequelize = require('../database');

const tipoApoiador = sequelize.define(
  'tipoApoiador',
  {
    descricao: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: 'Campo Nome não pode ser vazio',
        },
        len: {
          args: [3, 255],
          msg: 'Nome deve ter entre 3 a 255 caracteres',
        },
      },
    },
  },
  {
    tableName: 'tipoApoiador',
  }
);

module.exports = tipoApoiador;
