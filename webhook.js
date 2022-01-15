const Router = require('express').Router();
const axios = require('axios');
const config = require('./config');
const Contatos = require('./database/models/contatos');
const Apoiador = require('./database/models/apoiador');
const { Op } = require("sequelize");
const superagent = require('superagent');
const { response } = require('express');
require('superagent-queue');

const headers = {
    'Content-Type': 'application/json;charset=utf-8'
};

const pacote = `${config.api_url}/v1/getProfilePicture`
console.log(pacote)


Router.post('/webhook', async (req, res) => {
    console.log(req.body)
    res.end();
})

Router.post('/contatos', async (req, res) => {
    // webhook para extração dos contatos
    console.log(req.body)
    try {
        // recebe os contatos em um array que são enviados pelo baileys apos a leitura do qrcode 
        var contacts = req.body;
        // faz a pesquisa na tabela apoiador , verificando se o apoiador que fez a leitura do qrcode ja existe no sistema ,
        // se o result =='' cadastra o apoiador na tabela apoiador e cadastra dos os seus contatos na taleba contato.
        Apoiador.findAll({
            where: {
                whatsapp: {
                    [Op.eq]: contacts[0].telefone,
                }
            }
        }).then(async (result) => {
            if (result == '') {
                await Apoiador.create({
                    nome: contacts[0].patrocinador,
                    whatsapp: contacts[0].telefone,
                    EmpresaId: contacts[0].empresaId
                }).then((result) => {
                    contacts.map(async (item) => {
                        await Contatos.create({
                            whatsapp: item.whatsapp,
                            nome: item.nome,
                            apoiador: item.apoiador,
                            ApoiadorId: result.id
                        })
                    });
                })
            }
        }).catch((error) => {
            console.log(error)
        });




        // var contacts = req.body;
        // contacts.map((item) => {
        //     axios.post(`${config.api_url}/v1/getProfilePicture`, { 'session': 'eduardo1', 'to': item.whatsapp }, (headers)).then((value) => {
        //         console.log(value.data)
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        // });
        // res.send(value);
        // for (var i in contacts) {
        //     console.log(contacts[i].whatsapp)
        //     await Contatos.create({
        //         whatsapp: contacts[i].whatsapp,
        //         nome: contacts[i].nome,
        //         apoiador: contacts[i].apoiador
        //     })
        //     let body = {
        //         'session': 'eduardo1',
        //         'to': contacts[i].whatsapp
        //     }
        //     axios.post(`${config.api_url}/v1/getProfilePicture`, { body }, (headers)).then((value) => {
        //         console.log(value.data.url)
        //     }).cath()
        //     res.send(value);
        // }
    } catch (error) {
        console.log(error)
    }
})
Router.post('/QRCode', async (req, res) => {
    req.io.emit('qrCode', req.body)
    res.end();
})

module.exports = Router;