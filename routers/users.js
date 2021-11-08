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
const multer = require('multer');
const User = require('../database/models/user');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const moment = require('moment');
moment.locale('pt-br');
const isLogged = require('../middlewares/isLogged');
const adminAuth = require('../middlewares/adminAuth');


let arquivo = 'sem_foto.jpg';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/users');
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, file.originalname);
    }
});

let fileFilter = function (req, file, cb) {
    var allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb({
            success: false,
            message: 'Tipo de arquivo inválido. Somente arquivos de imagem são permitidos'
        }, false);
    }
};
let obj = {
    storage: storage,
    limits: {
        files: 1,
        fileSize: 5 * (1024 * 1024)
    },
    fileFilter: fileFilter
};
const upload = multer(obj).single('file');

Router.route('/user/addUser')
    .get(isLogged, adminAuth, (req, res) => {
        res.render('users/addUser', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success')
        });
    })
    .post((req, res) => {
        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var perfil = req.body.perfil;
        var cargo = req.body.cargo;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        var img = arquivo;

        User.create({
            name: name,
            email: email,
            username: username,
            password: hash,
            perfil: perfil,
            cargo: cargo,
            img: img
        }).then((result) => {
            req.flash('success', 'Cadastrado com Sucesso!');
            res.redirect('/user/addUser');
        }).catch(err => {
            if (err.name === 'SequelizeValidationError') {
                err.errors.map(e => {
                    req.flash('error', e.message);
                });
                res.redirect('/user/addUser');
            } else {
                req.flash('error', err);
                res.redirect('/user/addUser');
            }
        });
    });

Router.get('/user/edit/:id', isLogged, adminAuth, (req, res) => {
    let id = req.params.id;
    if (isNaN(id)) {
        req.flash('error', 'Ocorreu um erro ao tentar acessar, codigo ID não é numerico');
        res.redirect('/users/list');
    }
    User.findByPk(id).then(usuarios => {
        if (usuarios !== undefined) {
            res.render('users/editUser', {
                usuario: res.locals.user,
                error: req.flash('error'),
                success: req.flash('success'),
                usuarios: usuarios,
            })
        }
        else {
            req.flash('error', 'Ocorreu um erro ao tentar acessar');
            res.redirect('/users/list');
        }
    }).catch(error => {
        req.flash('erro', `Ocorreu o seguinte erro: ${error}`);
        console.log(error)
        res.redirect('/users/list');
    })
});
Router.post('/user/edit', isLogged, adminAuth, (req, res) => {

    let password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    let email = req.body.email;
    email = email.trim();

    if (password === '') {
        if (arquivo === 'sem_foto.jpg') {
            User.update({
                name: req.body.name,
                email: email,
                username: req.body.username,
                perfil: req.body.perfil,
                cargo: req.body.cargo,
            }, {
                where: {
                    id: {
                        [Op.eq]: req.body.id
                    }
                }
            }).then((result) => {
                req.flash('success', `Alterado com Sucesso!`);
                res.redirect('/users/list');

            }).catch((error) => {
                req.flash('error', `Ocorreu o seguinte erro: ${error}`);
                console.log(error)
                res.redirect('/users/list');
            });
        }
        else
            if (arquivo !== 'sem_foto.jpg') {
                User.update({
                    name: req.body.name,
                    email: email,
                    username: req.body.username,
                    perfil: req.body.perfil,
                    cargo: req.body.cargo,
                    img: arquivo
                }, {
                    where: {
                        id: {
                            [Op.eq]: req.body.id
                        }
                    }
                }).then((result) => {
                    req.flash('success', `Alterado com Sucesso!`);
                    res.redirect('/users/list');

                }).catch((error) => {
                    req.flash('error', `Ocorreu o seguinte erro: ${error}`);
                    console.log(error)
                    res.redirect('/users/list');
                });
            }
    }
    if (password !== '') {
        if (arquivo === 'sem_foto.jpg') {
            User.update({
                name: req.body.name,
                email: email,
                username: req.body.username,
                password: hash,
                perfil: req.body.perfil,
                cargo: req.body.cargo,
            }, {
                where: {
                    id: {
                        [Op.eq]: req.body.id
                    }
                }
            }).then((result) => {
                req.flash('success', `Alterado com Sucesso!`);
                res.redirect('/users/list');

            }).catch((error) => {
                req.flash('error', `Ocorreu o seguinte erro: ${error}`);
                console.log(error)
                res.redirect('/users/list');
            });
        }
        else
            if (arquivo !== 'sem_foto.jpg') {
                User.update({
                    name: req.body.name,
                    email: email,
                    username: req.body.username,
                    password: hash,
                    perfil: req.body.perfil,
                    cargo: req.body.cargo,
                    img: arquivo
                }, {
                    where: {
                        id: {
                            [Op.eq]: req.body.id
                        }
                    }
                }).then((result) => {
                    req.flash('success', `Alterado com Sucesso!`);
                    res.redirect('/users/list');

                }).catch((error) => {
                    req.flash('error', `Ocorreu o seguinte erro: ${error}`);
                    console.log(error)
                    res.redirect('/users/list');
                });
            }
    }
})

Router.get('/getUserbyId', (req, res) => {
    User.findAll({
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
    User.update({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        perfil: req.body.perfil,
        cargo: req.body.cargo,
        img: req.body.img
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

Router.post('/users/delete', isLogged, (req, res) => {
    let id = req.body.id;
    if (id !== undefined) {
        if (!isNaN(id)) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                req.flash('success', 'Item deletado com Sucesso!');
                res.redirect('/users/list')
            }).catch((error) => {
                req.flash('error', 'Ocorreu o seguinte erro ao tentar deletar' + error);
            });
        }
        else {
            res.redirect('/users/list');
        }
    }
    else {
        res.redirect('/users/list');
    }
});

Router.post('/updateImg', isLogged, (req, res) => {
    upload(req, res, function (error, result) {
        if (error) {
            res.status(500);
            if (error.code == 'LIMIT_FILE_SIZE') {
                error.message = 'O tamanho maximo permitido do arquivo é 5 MB';
                error.success = false;
            }
            return res.json(error.message);
        } else {
            if (!req.file) {
                res.status(500);
                res.json('Arquivo não encontrado');
            }
            if (result) {
                res.status(200);
                res.json({
                    success: true,
                    message: 'Upload com sucesso!'
                });
            }
        }
        arquivo = req.file.originalname;
    })
});

Router.get('/users/list', isLogged, (req, res) => {
    User.findAll().then(usuarios => {
        res.render('users/getUsers', {
            usuario: res.locals.user,
            error: req.flash('error'),
            success: req.flash('success'),
            usuarios: usuarios
        });
    }).catch(error => {
        res.json('deu erro' + error)
    })
});

module.exports = Router;