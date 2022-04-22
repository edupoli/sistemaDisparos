/*##############################################################################
# File: fnSockets.js                                                           #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 19:02:49                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-19 15:01:33                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/
module.exports = class Sockets {
  constructor(io) {
    this.io = io;
  }
  //emitindo mensagem que qrcode mudou
  qrCode(session, data) {
    this.io.to(session).emit('qrcode', data);
    return true;
  }

  //mudando statusFind
  statusFind(session, data) {
    this.io.to(session).emit('statusFind', data);
    return true;
  }
  //detectando start do servidor
  start(session, data) {
    this.io.to(session).emit('start', data);
    return true;
  }
  //enviando mensagem como emissor
  messagesent(session, data) {
    this.io.to(session).emit('messagesent', data);
    return true;
  }
  //recebendo mensagens
  message(session, data) {
    this.io.to(session).emit('message', data);
    return true;
  }
  //mudando status
  stateChange(session, data) {
    this.io.to(session).emit('stateChange', data);
    return true;
  }
  //webhook para detecção de alteracoes de status nas mensagens
  ack(session, data) {
    this.io.to(session).emit('ack', data);
    return true;
  }
  //Função para emitir mensagens de status
  events(session, data) {
    this.io.to(session).emit('events', data);
  }
  //Função para emitir um alerta
  alert(session, data) {
    this.io.to(session).emit('alert', data);
    return true;
  }
  queue(data) {
    this.io.emit('queue', data);
    return true;
  }
};
