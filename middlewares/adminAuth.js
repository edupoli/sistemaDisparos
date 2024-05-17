/*##############################################################################
# File: adminAuth.js                                                           #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-17 23:32:21                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-08-11 15:24:37                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

let adminAuth = (req, res, next) => {
  if (req.user !== undefined && req.user.perfil === 'administrador') {
    next();
  } else {
    req.flash(
      'message',
      'Acesso permitido apenas para usuarios Administradores '
    );
    res.redirect('back');
  }
};
module.exports = adminAuth;
