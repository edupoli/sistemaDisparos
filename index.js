// /*##############################################################################
// # File: index.js                                                               #
// # Project: sistema-de-disparos                                                 #
// # Created Date: 2021-06-17 22:56:40                                            #
// # Author: Eduardo Policarpo                                                    #
// # Last Modified: 2022-06-14 19:12:19                                           #
// # Modified By: Eduardo Policarpo                                               #
// ##############################################################################*/

// ('use strict');
// const cors = require('cors');
// const express = require('express');
// const app = express();
// const path = require('path');
// const server = require('http').Server(app);
// const session = require('express-session');
// const passport = require('passport');
// const flash = require('connect-flash');
// const config = require('./envConfig');
// const router = require('./routers/index');
// const users = require('./routers/users');
// const empresas = require('./routers/empresas');
// const tipoApoiador = require('./routers/tipoApoiador');
// const apoiadores = require('./routers/apoiadores');
// const contatos = require('./routers/contatos');
// const mensagem = require('./routers/mensagem');
// const loginRouter = require('./routers/login');
// const start = require('./routers/StartSession');
// const disparos = require('./routers/disparos');
// const webhook = require('./webhook');
// const { logger } = require('./logger');
// const sequelize = require('./database/database');
// const cookieSession = require('cookie-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const io = require('socket.io')(server, {
//   cors: {
//     origins: ['*'],
//     methods: ['GET', 'POST'],
//     transports: ['websocket', 'polling'],
//     credentials: true,
//   },
//   allowEIO3: true,
// });

// io.on('connection', (socket) => {
//   logger.info(`ID: ${socket.id} socket in`);

//   socket.on('room', (room) => {
//     if (socket.room) {
//       socket.leave(socket.room);
//     }
//     socket.join(room);
//     socket.room = room;
//   });

//   socket.on('join', (data) => {
//     console.log(data);
//     console.log(chalk.green('Conectou: ') + data.name);

//     users[socket.id] = {};
//     users[socket.id].name = data.name;
//     users[socket.id].id = data.id;
//     users[socket.id].sessaoname = data.sessaoname;
//     socket
//       .emit(users[socket.id].sessaoname)
//       .emit('updateUser', 'Você se conectou ao servidor.');
//     socket.broadcast
//       .to(users[socket.id].sessaoname)
//       .emit('updateUser', users[socket.id].name + ' ingressou no servidor.');
//   });

//   socket.on('disconnect', () => {
//     if (users[socket.id]) {
//       console.log(chalk.red('Desconectou: ') + users[socket.id].name);
//       socket.broadcast
//         .to(users[socket.id].sessaoname)
//         .emit('updateUser', users[socket.id].name + ' saiu do servidor.');
//     }
//     delete users[socket.id];
//   });
// });

// app.use(
//   cookieSession({
//     name: 'session',
//     keys: ['key1', 'key2'],
//     maxAge: 24 * 60 * 60 * 1000, // 24 horas
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
// require('./auth')(passport);
// app.use(cors());
// app.use(flash());

// app.use(express.json({ limit: '300mb' }));
// app.use(express.urlencoded({ extended: false }));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.set('json spaces', 2);
// app.use(express.static('public'));
// express.static(path.join(__dirname, '/public'));

// app.use((req, res, next) => {
//   req.io = io;
//   res.locals.user = req.user;
//   next();
// });

// app.use('/', router);
// app.use(users);
// app.use(empresas);
// app.use(apoiadores);
// app.use(tipoApoiador);
// app.use(mensagem);
// app.use(contatos);
// app.use(loginRouter);
// app.use(start);
// app.use(disparos);
// app.use(webhook);

// if (config.https == 1) {
//   https
//     .createServer(
//       {
//         key: fs.readFileSync(config.ssl_key_path),
//         cert: fs.readFileSync(config.ssl_cert_path),
//       },
//       server
//     )
//     .listen(config.port, async (error) => {
//       console.log(`Http server running on ${config.host}:${config.port}\n\n`);
//     });
// } else {
//   server.listen(config.port, async (error) => {
//     console.log(`Http server running on ${config.host}:${config.port}`);
//   });
// }

// process.stdin.resume();

// async function exitHandler(options, exitCode) {
//   if (exitCode || exitCode === 0) {
//     console.log(exitCode);
//   }

//   if (options.exit) {
//     process.exit();
//   }
// }

// process.on('exit', exitHandler.bind(null, { cleanup: true }));
// process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
// process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
// process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

// estava usando essa

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

// //########
// // Importações
// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const session = require('express-session');
// const passport = require('passport');
// const flash = require('connect-flash');
// const path = require('path');
// const { Server } = require('socket.io');
// const fs = require('fs');
// const https = require('https');

// const config = require('./envConfig');
// const logger = require('./logger');
// const sequelize = require('./database/database');
// const setupPassport = require('./auth');

// // Routers
// const router = require('./routers');

// // Inicialização do Express e HTTP Server
// const app = express();
// const server = http.Server(app);

// // Configuração do Socket.IO
// const io = new Server(server, {
//     cors: {
//         origins: '*:*',
//         methods: ['GET', 'POST']
//     }
// });

// require('./sockets')(io, logger);

// // Configurações do Express
// app.use(cors());
// app.use(express.json({ limit: '300mb' }));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Configuração de sessão
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
// app.use(session({
//     secret: config.sessionSecret,
//     store: new SequelizeStore({ db: sequelize }),
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: config.secureCookie }
// }));

// // Inicialização do Passport
// app.use(passport.initialize());
// app.use(passport.session());
// setupPassport(passport);

// // Mensagens Flash
// app.use(flash());

// // Rotas
// app.use(router);

// // Iniciar o servidor
// const startServer = () => {
//     const port = config.port;
//     server.listen(port, () => {
//         logger.info(`Servidor rodando em http://${config.host}:${port}`);
//     });
// };

// startServer();

// // Tratamento de exceções
// process.on('uncaughtException', (error) => {
//     logger.error(`Exceção não capturada: ${error}`);
//     process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//     logger.error('Rejeição não tratada:', promise, 'motivo:', reason);
// });
