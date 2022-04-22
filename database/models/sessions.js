/*##############################################################################
# File: sessions.js                                                            #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-14 04:21:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-14 04:43:50                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/
const Sequelize = require('sequelize');
const connection = require('../database');

const Sessions = connection.define('Sessions', {
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
  clientID: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  serverToken: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  clientToken: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  encKey: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  macKey: {
    allowNull: true,
    type: Sequelize.STRING,
  },
});

//force: true faz com que a tabela seja criada ou atualizada no BD
// Sessions.sync({ force: true })
//   .then(() => {
//     console.log('tabela criada/atualizada com sucesso no BD');
//   })
//   .catch((error) => {
//     console.log('erro ao sincronizar a tabela no BD', error);
//   });

module.exports = Sessions;
