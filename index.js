// /*##############################################################################
// # File: index.js                                                               #
// # Project: sistema-de-disparos                                                 #
// # Created Date: 2021-06-17 22:56:40                                            #
// # Author: Eduardo Policarpo                                                    #
// # Last Modified: 2022-06-14 19:12:19                                           #
// # Modified By: Eduardo Policarpo                                               #
// ##############################################################################*/

'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const config = require('./envConfig');
const sequelize = require('./database/database');
const router = require('./routers/index');
const users = require('./routers/users');
const empresas = require('./routers/empresas');
const tipoApoiador = require('./routers/tipoApoiador');
const apoiadores = require('./routers/apoiadores');
const contatos = require('./routers/contatos');
const mensagem = require('./routers/mensagem');
const loginRouter = require('./routers/login');
const start = require('./routers/StartSession');
const disparos = require('./routers/disparos');
const { logger } = require('./logger');
const { initSocket } = require('./sockets/init');

const app = express();
const server = http.Server(app);
const cookieSession = require('cookie-session');

const io = initSocket(server);

io.on('connection', (socket) => {
  logger.info(`ID: ${socket.id} socket in`);

  socket.on('room', (room) => {
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.join(room);
    socket.room = room;
  });

  socket.on('join', (data) => {
    console.log(data);
    console.log(chalk.green('Conectou: ') + data.name);

    users[socket.id] = {};
    users[socket.id].name = data.name;
    users[socket.id].id = data.id;
    users[socket.id].sessaoname = data.sessaoname;
    socket
      .emit(users[socket.id].sessaoname)
      .emit('updateUser', 'Você se conectou ao servidor.');
    socket.broadcast
      .to(users[socket.id].sessaoname)
      .emit('updateUser', users[socket.id].name + ' ingressou no servidor.');
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      console.log(chalk.red('Desconectou: ') + users[socket.id].name);
      socket.broadcast
        .to(users[socket.id].sessaoname)
        .emit('updateUser', users[socket.id].name + ' saiu do servidor.');
    }
    delete users[socket.id];
  });
});

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./auth')(passport);

app.use(cors());
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(flash());

// Pass socket.io to routes
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
app.use(disparos);

server.listen(config.port, async () => {
  console.log(`Server running on ${config.host}:${config.port}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    sequelize.close().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});
