const express = require('express');
const Router = express.Router();
const Empresa = require('../database/models/empresa');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');
const config = require('../config');
const client = require('../whatsapp/sessions');

Router.get('/linkEmpresas', isLogged, adminAuth, (req, res) => {
  Empresa.findAll().then((empresa) => {
    res.render('linkEmpresa/links', {
      usuario: res.locals.user,
      error: req.flash('error'),
      success: req.flash('success'),
      empresa: empresa,
      config: config,
    });
  });
});

Router.get('/start/session/:enpresaId', (req, res) => {
  res.render('start', { empresaId: req.params.enpresaId });
});

Router.post('/v1/start/:session/:empresaId', (req, res) => {
  client.Start(req, res);
});

module.exports = Router;
