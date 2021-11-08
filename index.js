/*##############################################################################
# File: index.js                                                               #
# Project: chatbot-delivery                                                    #
# Created Date: 2021-06-17 22:56:40                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-08-12 09:55:32                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

'use strict';
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path')
const server = require('http').Server(app);
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const config = require('./config');
const router = require('./routers/index');
const users = require('./routers/users');
const empresas = require('./routers/empresas');
const tipoApoiador = require('./routers/tipoApoiador');
const apoiadores = require('./routers/apoiadores');
const contatos = require('./routers/contatos');
const mensagem = require('./routers/mensagem');
const loginRouter = require('./routers/login');
const start = require('./routers/StartSession');
const webhook = require('./webhook');

const io = require('socket.io')(server, {
    cors: {
        origins: ["*"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

require('./auth')(passport);
app.use(session({
    secret: "$2a$10$PW6yScsTiHEXTDhppToBz.92gUoRkPp2.LTYSmP1UVm3DtKjYTvdm",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1 * 60 * 60 * 1000 }  // (60*1000)= 1minuto / (30*60*1000) = 30 minutos / (60*60*1000)= 1 hora
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('json spaces', 2);
app.use(express.static('public'));
express.static(path.join(__dirname, '/public'));

app.use((req, res, next) => {
    req.io = io;
    res.locals.user = req.user;
    next();
});

app.use('/', router);
app.use(users);
app.use(empresas);
app.use(apoiadores);
app.use(tipoApoiador);
app.use(mensagem);
app.use(contatos);
app.use(loginRouter);
app.use(start);
app.use(webhook);

io.on('connection', sock => {
    console.log(`ID: ${sock.id} socket in`)

    sock.on('event', data => {
        console.log(data)
    });

    sock.on('disconnect', () => {
        console.log(`ID: ${sock.id} socket out`)
    });
});

if (config.https == 1) {
    https.createServer(
        {
            key: fs.readFileSync(config.ssl_key_path),
            cert: fs.readFileSync(config.ssl_cert_path)
        },
        server).listen(config.port, async (error) => {
            console.log(`Http server running on ${config.host}:${config.port}\n\n`);
        });
}
else {
    server.listen(config.port, async (error) => {
        console.log(`Http server running on ${config.host}:${config.port}`);
    });
}

process.stdin.resume();

async function exitHandler(options, exitCode) {
    if (exitCode || exitCode === 0) {
        console.log(exitCode);
    }

    if (options.exit) {
        process.exit();
    }
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));