/*##############################################################################
# File: login.js                                                               #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-18 01:48:08                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-08-11 13:47:13                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const express = require('express');
const Router = express.Router();
const passport = require('passport');

Router.route('/login')
    .get((req, res) => {
        res.render('login', {
            error: req.flash('error'),
            success: req.flash('success')
        });
    })
    .post(async (req, res, next) => {
        let username = req.body.username;
        let password = req.body.password;

        if (username === '') {
            req.flash('error', 'Por favor digite o LOGIN');
            res.redirect('/login');
        }
        else if (password === '') {
            req.flash('error', 'Por favor digite sua SENHA');
            res.redirect('/login');
        }
        else {
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res, next)
        }
    })

module.exports = Router;