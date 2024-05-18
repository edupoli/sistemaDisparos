/*##############################################################################
# File: index.js                                                               #
# Project: sistema-de-disparos                                                 #
# Created Date: 2021-06-17 23:24:52                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-20 11:45:05                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const Empresa = require('../database/models/empresa');
const Mensagem = require('../database/models/mensagem');
const isLogged = require('../middlewares/isLogged');

Router.get('/', isLogged, async (req, res) => {
  let contatos = await Contatos.findAll();
  let apoiador = await Apoiador.findAll();
  let empresa = await Empresa.findAll();
  let mensagem = await Mensagem.findAll();
  res.render('home', {
    usuario: res.locals.user,
    contatos: contatos.length,
    apoiador: apoiador.length,
    empresa: empresa.length,
    mensagem: mensagem.length,
    error: req.flash('error'),
    success: req.flash('success'),
  });
});

Router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send('Unable to log out');
      } else {
        res.redirect('/login');
      }
    });
  } else {
    res.end();
  }
});

module.exports = Router;
