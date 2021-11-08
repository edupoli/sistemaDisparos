/*##############################################################################
# File: index.js                                                               #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-17 23:24:52                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-18 02:02:48                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const moment = require('moment');
moment.locale('pt-br');
const isLogged = require('../middlewares/isLogged');

Router.get('/', isLogged, (req, res) => {
    res.render('home', {
        usuario: res.locals.user,
        error: req.flash('error'),
        success: req.flash('success')
    })
})

Router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.redirect('/login')
            }
        });
    } else {
        res.end()
    }
})

module.exports = Router;
