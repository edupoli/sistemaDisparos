const Sequelize = require('sequelize');
const connection = require('../database');
const Empresa = require('./empresa');
const tipoApoiador = require('./tipoApoiador');

const Apoiador = connection.define('Apoiador', {
  nome: {
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
  whatsapp: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Campo WhatsApp não pode ser vazio',
      },
    },
  },
  telefone: {
    allowNull: true,
    type: Sequelize.STRING,
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
});

Apoiador.belongsTo(tipoApoiador);
Apoiador.belongsTo(Empresa);
//force: true faz com que a tabela seja criada ou atualizada no BD
// Apoiador.sync({ force: true })
//   .then(() => {
//     console.log('tabela criada/atualizada com sucesso no BD');
//   })
//   .catch((error) => {
//     console.log('erro ao sincronizar a tabela no BD', error);
//   });

module.exports = Apoiador;
