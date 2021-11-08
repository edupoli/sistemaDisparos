const express = require('express');
const Router = express.Router();

Router.get('/start', (req, res) => {
    console.log('aquiii')
    res.render('start')
})

module.exports = Router;