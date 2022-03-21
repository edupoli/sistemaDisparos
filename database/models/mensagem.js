const Sequelize = require('sequelize');
const connection = require('../database');
const Empresa = require('./empresa');

const Mensagem = connection.define('Mensagem', {
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

//force: true faz com que a tabela seja criada ou atualizada no BD
// Mensagem.sync({ force: true })
//   .then(() => {
//     console.log('tabela criada/atualizada com sucesso no BD');
//   })
//   .catch((error) => {
//     console.log('erro ao sincronizar a tabela no BD', error);
//   });

module.exports = Mensagem;
