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
const Empresa = require('../database/models/empresa');
const { Op } = require("sequelize");
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');

Router.route('/empresas/add')
    .get(isLogged, adminAuth, (req, res) => {
        res.render('empresas/add', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
    })
    .post((req, res) => {
        Empresa.create({
            nome: req.body.nome,
            contato: req.body.contato,
            telefone: req.body.telefone,
            celular: req.body.celular,
            cep: req.body.cep,
            endereco: req.body.endereco,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            uf: req.body.uf,
            observacoes: req.body.observacoes
        }).then((result) => {
            req.flash('success', 'Cadastrado com Sucesso!');
            res.redirect('/empresas/add');
        }).catch(err => {
            if (err.name === 'SequelizeValidationError') {
                err.errors.map(e => {
                    req.flash('error', e.message);
                });
                res.redirect('/empresas/add');
            } else {
                req.flash('error', err);
                res.redirect('/empresas/add');
            }
        });
    });

Router.get('/empresas/edit/:id', isLogged, adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        req.flash('error', 'Ocorreu um erro ao tentar acessar, codigo ID não é numerico');
        res.redirect('/empresas/list');
    }
    Empresa.findByPk(id).then(empresa => {
        if (empresa !== undefined) {
            res.render('empresas/edit', {
                usuario: res.locals.user,
                error: req.flash('error'),
                success: req.flash('success'),
                empresa: empresa,
            })
        }
        else {
            req.flash('error', 'Ocorreu um erro ao tentar acessar');
            res.redirect('/empresas/list');
        }
    }).catch(error => {
        req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/empresas/list');
    })
});

Router.post('/empresas/edit', isLogged, adminAuth, (req, res) => {
    Empresa.update({
        nome: req.body.nome,
        contato: req.body.contato,
        telefone: req.body.telefone,
        celular: req.body.celular,
        cep: req.body.cep,
        endereco: req.body.endereco,
        numero: req.body.numero,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
        observacoes: req.body.observacoes
    }, {
        where: {
            id: {
                [Op.eq]: req.body.id
            }
        }
    }).then((result) => {
        req.flash('success', `Alterado com Sucesso!`);
        res.redirect('/empresas/list');

    }).catch((error) => {
        req.flash('error', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/empresas/list');
    });
})

Router.get('/getUserbyId', (req, res) => {
    Empresa.findAll({
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
    Empresa.update({
        nome: req.body.nome,
        contato: req.body.contato,
        telefone: req.body.telefone,
        celular: req.body.celular,
        cep: req.body.cep,
        endereco: req.body.endereco,
        numero: req.body.numero,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
        observacoes: req.body.observacoes
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

Router.post('/empresas/delete', isLogged, (req, res) => {
    let id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) {
            Empresa.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                req.flash('success', 'Item deletado com Sucesso!');
                res.redirect('/empresas/list')
            }).catch((error) => {
                req.flash('error', 'Ocorreu o seguinte erro ao tentar deletar' + error);
            });
        }
        else {
            res.redirect('/empresas/list');
        }
    }
    else {
        res.redirect('/empresas/list');
    }
});

Router.get('/empresas/list', isLogged, (req, res) => {
    Empresa.findAll().then(empresa => {
        res.render('empresas/list', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success'),
            empresa: empresa
        });
    }).catch(error => {
        res.json('deu erro' + error)
    })
});

module.exports = Router;