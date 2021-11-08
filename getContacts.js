const Router = require('express').Router();

Router.post('/getContacts', async (req, res) => {
    console.log(req.body)
})

module.exports = Router;