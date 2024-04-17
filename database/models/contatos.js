const Sequelize = require('sequelize');
const sequelize = require('../database');
const Apoiador = require('./apoiador');

const Contatos = sequelize.define(
  'Contatos',
  {
    nome: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    whatsapp: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    email: {
      allowNull: true,
      type: Sequelize.STRING,
      unique: {
        args: true,
        msg: 'Esse e-mail já está cadastrado, por favor use outro',
      },
      validate: {
        isEmail: {
          msg: 'Email inválido',
        },
      },
    },
    cep: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    endereco: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    numero: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    bairro: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    cidade: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    uf: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    img: {
      allowNull: true,
      type: Sequelize.BLOB,
    },
    observacao: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    ApoiadorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['whatsapp', 'ApoiadorId'],
        name: 'unique_whatsapp_per_apoiador',
      },
    ],
  }
);

Contatos.belongsTo(Apoiador, { foreignKey: 'ApoiadorId' });

module.exports = Contatos;
