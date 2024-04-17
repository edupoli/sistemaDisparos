/*##############################################################################
# File: users.js                                                               #
# Project: sistema-de-disparos                                                 #
# Created Date: 2021-06-17 23:25:14                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-20 19:27:26                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const { Op } = require('sequelize');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');

const Sequelize = require('sequelize');

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

// No seu arquivo de rotas
Router.get('/contatos/data', async (req, res) => {
  const draw = parseInt(req.query.draw);
  const start = parseInt(req.query.start);
  const length = parseInt(req.query.length);

  const totalRecords = await Contatos.count();
  const data = await Contatos.findAll({
    include: [{ model: Apoiador, attributes: ['nome'] }],
    offset: start,
    limit: length,
    // Adicione qualquer lógica de ordenação ou filtragem aqui
  });

  res.json({
    draw: draw,
    recordsTotal: totalRecords,
    recordsFiltered: totalRecords, // Altere caso aplique filtragem
    data: data.map((contato) => ({
      id: contato.id,
      nome: contato.nome,
      whatsapp: contato.whatsapp,
      Apoiador: contato.Apoiador ? contato.Apoiador.nome : 'N/A',
      actions: '', // Aqui você pode adicionar botões de ação se necessário
    })),
  });
});

Router.get('/contatos/list/data', async (req, res) => {
  try {
    const draw = req.query.draw;
    const recordsTotal = await Contatos.count();
    const recordsFiltered = recordsTotal; // Adapte esta lógica conforme necessário

    const contatos = await Contatos.findAll({
      include: [{ model: Apoiador, attributes: ['nome'] }],
      limit: req.query.length, // Paginação
      offset: req.query.start, // Paginação
    });

    res.json({
      draw: draw,
      recordsTotal: recordsTotal,
      recordsFiltered: recordsFiltered,
      data: contatos,
    });
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).send('Erro no servidor');
  }
});

Router.get('/contatos/list', isLogged, async (req, res) => {
  try {
    const limit = 80; // Número de registros por página
    const page = req.query.page || 1; // Página atual, padrão é 1
    const offset = (page - 1) * limit;

    const contatos = await Contatos.findAll({
      include: [
        {
          model: Apoiador,
          required: true,
          attributes: ['nome'],
        },
      ],
      limit: limit,
      offset: offset,
    });

    console.log(JSON.stringify(contatos, null, 2));

    res.render('contatos/list', {
      usuario: res.locals.user,
      error: req.flash('error'),
      success: req.flash('success'),
      contatos: contatos,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Erro ao buscar contatos', error: error.message });
  }
});

module.exports = Router;
