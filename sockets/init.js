// socket.js
const { Server } = require('socket.io');
let io;

module.exports = {
  initSocket: (server) => {
    io = new Server(server, {
      cors: {
        origins: ['*'],
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
        credentials: true,
      },
      allowEIO3: true,
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
