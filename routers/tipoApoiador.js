/*##############################################################################
# File: users.js                                                               #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-17 23:25:14                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-18 01:21:17                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const tipoApoiador = require('../database/models/tipoApoiador');
const { Op } = require("sequelize");
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');

Router.route('/tipoApoiador/add')
    .get(isLogged, adminAuth, (req, res) => {
        res.render('tipoApoiador/add', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
    })
    .post((req, res) => {
        tipoApoiador.create({
            descricao: req.body.descricao
        }).then((result) => {
            req.flash('success', 'Cadastrado com Sucesso!');
            res.redirect('/tipoApoiador/add');
        }).catch(err => {
            if (err.name === 'SequelizeValidationError') {
                err.errors.map(e => {
                    req.flash('error', e.message);
                });
                res.redirect('/tipoApoiador/add');
            } else {
                req.flash('error', err);
                res.redirect('/tipoApoiador/add');
            }
        });
    });

Router.get('/tipoApoiador/edit/:id', isLogged, adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        req.flash('error', 'Ocorreu um erro ao tentar acessar, codigo ID não é numerico');
        res.redirect('/tipoApoiador/list');
    }
    tipoApoiador.findByPk(id).then(tipo => {
        if (tipo !== undefined) {
            res.render('tipoApoiador/edit', {
                usuario: res.locals.user,
                error: req.flash('error'),
                success: req.flash('success'),
                tipo: tipo,
            })
        }
        else {
            req.flash('error', 'Ocorreu um erro ao tentar acessar');
            res.redirect('/tipoApoiador/list');
        }
    }).catch(error => {
        req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/tipoApoiador/list');
    })
});

Router.post('/tipoApoiador/edit', isLogged, adminAuth, (req, res) => {
    tipoApoiador.update({
        descricao: req.body.descricao
    }, {
        where: {
            id: {
                [Op.eq]: req.body.id
            }
        }
    }).then((result) => {
        req.flash('success', `Alterado com Sucesso!`);
        res.redirect('/tipoApoiador/list');

    }).catch((error) => {
        req.flash('error', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/tipoApoiador/list');
    });
})

Router.get('/getUserbyId', (req, res) => {
    tipoApoiador.findAll({
        where: {
            id: {
                [Op.eq]: req.query.id,
            }
        }
    }).then((result) => {
        res.json(result)
    }).catch((error) => {
        res.json(error)
    });
});

Router.put('/update', (req, res) => {
    tipoApoiador.update({
        descricao: req.body.descricao,

    }, {
        where: {
            id: {
                [Op.eq]: req.body.id
            }
        }
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    });
});

Router.post('/tipoApoiador/delete', isLogged, (req, res) => {
    let id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) {
            tipoApoiador.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                req.flash('success', 'Item deletado com Sucesso!');
                res.redirect('/tipoApoiador/list')
            }).catch((error) => {
                req.flash('error', 'Ocorreu o seguinte erro ao tentar deletar' + error);
            });
        }
        else {
            res.redirect('/tipoApoiador/list');
        }
    }
    else {
        res.redirect('/tipoApoiador/list');
    }
});

Router.get('/tipoApoiador/list', isLogged, (req, res) => {
    tipoApoiador.findAll().then(tipo => {
        res.render('tipoApoiador/list', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success'),
            tipo: tipo
        });
    }).catch(error => {
        res.json('deu erro' + error)
    })
});

module.exports = Router;