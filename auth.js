/*##############################################################################
# File: auth.js                                                                #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-17 23:48:37                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-08-11 15:56:44                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./database/models/user');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      (username, password, done) => {
        Users.findOne({
          where: {
            username: username,
          },
        }).then((user) => {
          if (user == null) {
            return done(null, false, { message: 'Usuario não existe.' });
          }
          bcrypt.compare(password, user.password, (error, result) => {
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Senha incorreta.' });
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await Users.findByPk(id);
    if (user === null) {
      done(new Error('user não encontrado.'));
    } else {
      done(null, user);
    }
  });
};
