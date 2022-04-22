/*##############################################################################
# File: users.js                                                               #
# Project: sistema-de-disparos                                                 #
# Created Date: 2021-06-17 23:25:14                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-19 12:56:08                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const { Op } = require('sequelize');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');
const redis = require('redis');
const cache = redis?.createClient();

async function getCache(key) {
  return new Promise((resolve, reject) => {
    cache?.get(key, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

async function setCache(key, value) {
  return new Promise((resolve, reject) => {
    cache?.set(key, value, 'EX', 3600, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

Router.route('/contatos/add')

  .get(isLogged, adminAuth, (req, res) => {
    Apoiador.findAll().then((apoiador) => {
      res.render('contatos/add', {
        usuario: res.locals.user,
        error: req.flash('error'),
        success: req.flash('success'),
        apoiador: apoiador,
      });
    });
  })
  .post((req, res) => {
    Contatos.create({
      nome: req.body.nome,
      whatsapp: req.body.whatsapp,
      email: req.body.email,
      cep: req.body.cep,
      endereco: req.body.endereco,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      uf: req.body.uf,
      img: req.body.img,
      ApoiadorId: req.body.ApoiadorId,
    })
      .then((result) => {
        req.flash('success', 'Cadastrado com Sucesso!');
        res.redirect('/contatos/add');
      })
      .catch((err) => {
        if (err.name === 'SequelizeValidationError') {
          err.errors.map((e) => {
            req.flash('error', e.message);
          });
          res.redirect('/contatos/add');
        } else {
          req.flash('error', err);
          res.redirect('/contatos/add');
        }
      });
  });

Router.get('/contatos/edit/:id', isLogged, adminAuth, (req, res) => {
  let id = req.params.id;
  if (isNaN(id)) {
    req.flash(
      'error',
      'Ocorreu um erro ao tentar acessar, codigo ID não é numerico'
    );
    res.redirect('/contatos/list');
  }
  Contatos.findByPk(id)
    .then((contato) => {
      Apoiador.findAll().then((apoiador) => {
        if (contato !== undefined) {
          res.render('contatos/edit', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success'),
            apoiador: apoiador,
            contato: contato,
          });
        } else {
          req.flash('error', 'Ocorreu um erro ao tentar acessar');
          res.redirect('/contatos/list');
        }
      });
    })
    .catch((error) => {
      req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
      console.log(error);
      res.redirect('/contatos/list');
    });
});

Router.post('/contatos/edit', isLogged, adminAuth, (req, res) => {
  Contatos.update(
    {
      nome: req.body.nome,
      whatsapp: req.body.whatsapp,
      email: req.body.email,
      cep: req.body.cep,
      endereco: req.body.endereco,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      uf: req.body.uf,
      img: req.body.img,
      ApoiadorId: req.body.ApoiadorId,
    },
    {
      where: {
        id: {
          [Op.eq]: req.body.id,
        },
      },
    }
  )
    .then((result) => {
      req.flash('success', `Alterado com Sucesso!`);
      res.redirect('/contatos/list');
    })
    .catch((error) => {
      req.flash('error', `Ocorreu o seguinte erro: ${error}`);
      console.log(error);
      res.redirect('/contatos/list');
    });
});

Router.get('/getUserbyId', (req, res) => {
  Contatos.findAll({
    where: {
      id: {
        [Op.eq]: req.query.id,
      },
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json(error);
    });
});

Router.put('/update', (req, res) => {
  Contatos.update(
    {
      nome: req.body.nome,
      whatsapp: req.body.whatsapp,
      email: req.body.email,
      cep: req.body.cep,
      endereco: req.body.endereco,
      numero: req.body.numero,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      uf: req.body.uf,
      img: req.body.img,
      ApoiadorId: req.body.ApoiadorId,
    },
    {
      where: {
        id: {
          [Op.eq]: req.body.id,
        },
      },
    }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

Router.post('/contatos/delete', isLogged, (req, res) => {
  let id = req.body.id;
  if (id !== undefined) {
    if (!isNaN(id)) {
      Contatos.destroy({
        where: {
          id: id,
        },
      })
        .then(() => {
          req.flash('success', 'Item deletado com Sucesso!');
          res.redirect('/contatos/list');
        })
        .catch((error) => {
          req.flash(
            'error',
            'Ocorreu o seguinte erro ao tentar deletar' + error
          );
        });
    } else {
      res.redirect('/contatos/list');
    }
  } else {
    res.redirect('/contatos/list');
  }
});

Router.get('/contatos/list', isLogged, (req, res) => {
  Contatos.findAll()
    .then((contato) => {
      Apoiador.findAll().then((apoiador) => {
        res.render('contatos/list', {
          usuario: res.locals.user,
          error: req.flash('error'),
          success: req.flash('success'),
          contato: contato,
          apoiador: apoiador,
        });
      });
    })
    .catch((error) => {
      res.json('deu erro' + error);
    });
});

module.exports = Router;
