/*##############################################################################
# File: disparos.js                                                            #
# Project: template-sistema                                                    #
# Created Date: 2021-12-28 00:54:12                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-01-12 01:16:26                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const Mensagem = require('../database/models/mensagem');
const Empresa = require('../database/models/empresa');
const Contatos = require('../database/models/contatos');
const Apoiador = require('../database/models/apoiador');
const tipoApoiador = require('../database/models/tipoApoiador');
const { Op } = require("sequelize");
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');

Router.get('/disparos', isLogged, adminAuth, async (req, res) => {
    
    let mgs = await Mensagem.findAll();
    let empresas = await Empresa.findAll();
    let contatos = await Contatos.findAll();
    let apoiadores = await Apoiador.findAll();
    let tipo = await tipoApoiador.findAll();
    res.render('disparos/disparos', {
        usuario: res.locals.user,
        error: req.flash('error'),
        success: req.flash('success'),
        empresa: empresas,
        contato: contatos,
        apoiador: apoiadores,
        mensagem: mgs,
        tipo: tipo
        //config: config
    });
})

Router.get('/start/:enpresaId', (req, res) => {
    res.render('start', { empresaId: req.params.enpresaId })
})

// Router.route('/disparos')
//     .get(isLogged, adminAuth, (req, res) => {
//         Empresa.findAll().then((empresa) => {
//             res.render('disparos/disparos', {
//                 usuario: res.locals.user,
//                 error: req.flash('error'),
//                 success: req.flash('success'),
//                 empresa: empresa
//             });
//         })
//     })
//     .post((req, res) => {
//         Mensagem.create({
//             EmpresaId: req.body.empresa,
//             titulo: req.body.titulo,
//             body: req.body.body,
//             img: req.body.img
//         }).then((result) => {
//             req.flash('success', 'Cadastrado com Sucesso!');
//             res.redirect('/mensagem/add');
//         }).catch(err => {
//             if (err.name === 'SequelizeValidationError') {
//                 err.errors.map(e => {
//                     req.flash('error', e.message);
//                 });
//                 res.redirect('/mensagem/add');
//             } else {
//                 req.flash('error', err);
//                 res.redirect('/mensagem/add');
//             }
//         });
//     });

// Router.get('/mensagem/edit/:id', isLogged, adminAuth, (req, res) => {
//     let id = req.params.id;
//     if (isNaN(id)) {
//         req.flash('error', 'Ocorreu um erro ao tentar acessar, codigo ID não é numerico');
//         res.redirect('/mensagem/list');
//     }
//     Mensagem.findByPk(id).then(mensagem => {
//         Empresa.findAll().then((empresa) => {
//             if (mensagem !== undefined) {
//                 res.render('mensagem/edit', {
//                     usuario: res.locals.user,
//                     error: req.flash('error'),
//                     success: req.flash('success'),
//                     mensagem: mensagem,
//                     empresa: empresa
//                 })
//             }
//             else {
//                 req.flash('error', 'Ocorreu um erro ao tentar acessar');
//                 res.redirect('/mensagem/list');
//             }
//         })
//     }).catch(error => {
//         req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
//         console.log(error)
//         res.redirect('/mensagem/list');
//     })
// });

// Router.post('/mensagem/edit', isLogged, adminAuth, (req, res) => {
//     Mensagem.update({
//         EmpresaId: req.body.empresa,
//         titulo: req.body.titulo,
//         body: req.body.body,
//         img: req.body.img
//     }, {
//         where: {
//             id: {
//                 [Op.eq]: req.body.id
//             }
//         }
//     }).then((result) => {
//         req.flash('success', `Alterado com Sucesso!`);
//         res.redirect('/mensagem/list');

//     }).catch((error) => {
//         req.flash('error', `Ocorreu o seguinte erro: ${error}`);
//         console.log(error)
//         res.redirect('/mensagem/list');
//     });
// })

// Router.get('/getUserbyId', (req, res) => {
//     Mensagem.findAll({
//         where: {
//             id: {
//                 [Op.eq]: req.query.id,
//             }
//         }
//     }).then((result) => {
//         res.json(result)
//     }).catch((error) => {
//         res.json(error)
//     });
// });

// Router.put('/update', (req, res) => {
//     Mensagem.update({
//         empresaId: req.body.empresa,
//         titulo: req.body.titulo,
//         body: req.body.body,
//         img: req.body.img

//     }, {
//         where: {
//             id: {
//                 [Op.eq]: req.body.id
//             }
//         }
//     }).then((result) => {
//         res.json(result)
//     }).catch((err) => {
//         res.json(err)
//     });
// });

// Router.post('/mensagem/delete', isLogged, (req, res) => {
//     let id = req.body.id;
//     if (id !== undefined) {
//         if (!isNaN(id)) {
//             Mensagem.destroy({
//                 where: {
//                     id: id
//                 }
//             }).then(() => {
//                 req.flash('success', 'Item deletado com Sucesso!');
//                 res.redirect('/mensagem/list')
//             }).catch((error) => {
//                 req.flash('error', 'Ocorreu o seguinte erro ao tentar deletar' + error);
//             });
//         }
//         else {
//             res.redirect('/mensagem/list');
//         }
//     }
//     else {
//         res.redirect('/mensagem/list');
//     }
// });

// Router.get('/mensagem/list', isLogged, (req, res) => {
//     Mensagem.findAll().then(mensagem => {
//         res.render('mensagem/list', {
//             usuario: res.locals.user,
//             error: req.flash('error'),
//             success: req.flash('success'),
//             mensagem: mensagem
//         });
//     }).catch(error => {
//         res.json('deu erro' + error)
//     })
// });

module.exports = Router;