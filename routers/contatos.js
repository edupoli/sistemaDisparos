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
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const { Op } = require("sequelize");
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');

Router.route('/contato/add')

    .get(isLogged, adminAuth, (req, res) => {
        Apoiador.findAll().then((apoiador) => {
            res.render('contato/add', {
                usuario: res.locals.user,
                error: req.flash('error'),
                success: req.flash('success'),
                apoiador: apoiador
            });
        })
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
            ApoiadorId: req.body.ApoiadorId
        }).then((result) => {
            req.flash('success', 'Cadastrado com Sucesso!');
            res.redirect('/contato/add');
        }).catch(err => {
            if (err.name === 'SequelizeValidationError') {
                err.errors.map(e => {
                    req.flash('error', e.message);
                });
                res.redirect('/contato/add');
            } else {
                req.flash('error', err);
                res.redirect('/contato/add');
            }
        });
    });

Router.get('/contato/edit/:id', isLogged, adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        req.flash('error', 'Ocorreu um erro ao tentar acessar, codigo ID não é numerico');
        res.redirect('/contato/list');
    }
    Contatos.findByPk(id).then(contato => {
        Apoiador.findAll().then((apoiador) => {
            if (contato !== undefined) {
                res.render('contato/edit', {
                    usuario: res.locals.user,
                    error: req.flash('error'),
                    success: req.flash('success'),
                    apoiador: apoiador,
                    contato: contato,
                })
            }
            else {
                req.flash('error', 'Ocorreu um erro ao tentar acessar');
                res.redirect('/contato/list');
            }
        })
    }).catch(error => {
        req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/contato/list');
    })
});

Router.post('/contato/edit', isLogged, adminAuth, (req, res) => {
    Contatos.update({
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
        ApoiadorId: req.body.ApoiadorId
    }, {
        where: {
            id: {
                [Op.eq]: req.body.id
            }
        }
    }).then((result) => {
        req.flash('success', `Alterado com Sucesso!`);
        res.redirect('/contato/list');

    }).catch((error) => {
        req.flash('error', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/contato/list');
    });
})

Router.get('/getUserbyId', (req, res) => {
    Contatos.findAll({
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
    Contatos.update({
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
        ApoiadorId: req.body.ApoiadorId
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

Router.post('/contato/delete', isLogged, (req, res) => {
    let id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) {
            Contatos.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                req.flash('success', 'Item deletado com Sucesso!');
                res.redirect('/contato/list')
            }).catch((error) => {
                req.flash('error', 'Ocorreu o seguinte erro ao tentar deletar' + error);
            });
        }
        else {
            res.redirect('/contato/list');
        }
    }
    else {
        res.redirect('/contato/list');
    }
});

Router.get('/contato/list', isLogged, (req, res) => {

    Contatos.findAll().then((contato) => {
        Apoiador.findAll().then((apoiador) => {
            res.render('contato/list', {
                usuario: res.locals.user,
                error: req.flash('error'),
                success: req.flash('success'),
                contato: contato,
                apoiador: apoiador
            });
        })
    }).catch(error => {
        res.json('deu erro' + error)
    })
});

module.exports = Router;