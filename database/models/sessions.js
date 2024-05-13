/*##############################################################################
# File: sessions.js                                                            #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-14 04:21:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-06-13 10:59:40                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/
const Sequelize = require('sequelize');
const sequelize = require('../database');

const Sessions = sequelize.define('Sessions', {
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
  empresaId: {
    allowNull: false,
    type: Sequelize.NUMBER,
    validate: {
      notEmpty: {
        msg: 'Campo EmpresaID não pode ser vazio',
      },
    },
  },
});

module.exports = Sessions;
