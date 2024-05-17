/*##############################################################################
# File: isLogged.js                                                            #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-17 23:33:20                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-08-11 15:24:16                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

let isLogged = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'Sessão Expirada faça Login novamente');
    res.redirect('/login');
  }
};
module.exports = isLogged;
