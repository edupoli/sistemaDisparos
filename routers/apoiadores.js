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
const Apoiador = require('../database/models/apoiador');
const Empresa = require('../database/models/empresa');
const tipoApoiador = require('../database/models/tipoApoiador');
const { Op } = require("sequelize");
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');

Router.route('/apoiador/add')

    .get(isLogged, adminAuth, (req, res) => {
        Empresa.findAll().then((empresa) => {
            tipoApoiador.findAll().then((tipo) => {
                res.render('apoiador/add', {
                    usuario: res.locals.user,
                    error: req.flash('error'),
                    success: req.flash('success'),
                    empresa: empresa,
                    tipo: tipo
                });
            })
        })
    })
    .post((req, res) => {
        Apoiador.create({
            nome: req.body.nome,
            whatsapp: req.body.whatsapp,
            telefone: req.body.telefone,
            cep: req.body.cep,
            endereco: req.body.endereco,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            uf: req.body.uf,
            tipoApoiadorId: req.body.tipoApoiador,
            EmpresaId: req.body.empresa
        }).then((result) => {
            req.flash('success', 'Cadastrado com Sucesso!');
            res.redirect('/apoiador/add');
        }).catch(err => {
            if (err.name === 'SequelizeValidationError') {
                err.errors.map(e => {
                    req.flash('error', e.message);
                });
                res.redirect('/apoiador/add');
            } else {
                req.flash('error', err);
                res.redirect('/apoiador/add');
            }
        });
    });

Router.get('/apoiador/edit/:id', isLogged, adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        req.flash('error', 'Ocorreu um erro ao tentar acessar, codigo ID não é numerico');
        res.redirect('/apoiador/list');
    }
    Apoiador.findByPk(id).then(apoiador => {
        Empresa.findAll().then((empresa) => {
            tipoApoiador.findAll().then((tipo) => {
                if (apoiador !== undefined) {
                    res.render('apoiador/edit', {
                        usuario: res.locals.user,
                        error: req.flash('error'),
                        success: req.flash('success'),
                        empresa: empresa,
                        tipo: tipo,
                        apoiador: apoiador,
                    })
                }
                else {
                    req.flash('error', 'Ocorreu um erro ao tentar acessar');
                    res.redirect('/apoiador/list');
                }
            })
        })
    }).catch(error => {
        req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/apoiador/list');
    })
});

Router.post('/apoiador/edit', isLogged, adminAuth, (req, res) => {
    Apoiador.update({
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
        res.redirect('/apoiador/list');

    }).catch((error) => {
        req.flash('error', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/apoiador/list');
    });
})

Router.get('/getUserbyId', (req, res) => {
    Apoiador.findAll({
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
    Apoiador.update({
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

Router.post('/apoiador/delete', isLogged, (req, res) => {
    let id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) {
            Apoiador.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                req.flash('success', 'Item deletado com Sucesso!');
                res.redirect('/apoiador/list')
            }).catch((error) => {
                req.flash('error', 'Ocorreu o seguinte erro ao tentar deletar' + error);
            });
        }
        else {
            res.redirect('/apoiador/list');
        }
    }
    else {
        res.redirect('/apoiador/list');
    }
});

Router.get('/apoiador/list', isLogged, (req, res) => {

    Apoiador.findAll().then((apoiador) => {
        Empresa.findAll().then((empresa) => {
            tipoApoiador.findAll().then((tipo) => {
                res.render('apoiador/list', {
                    usuario: res.locals.user,
                    error: req.flash('error'),
                    success: req.flash('success'),
                    apoiador: apoiador,
                    empresa: empresa,
                    tipo: tipo
                });
            })
        })
    }).catch(error => {
        res.json('deu erro' + error)
    })
});

module.exports = Router;