/*##############################################################################
# File: sockets.js                                                             #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 18:27:20                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-13 18:28:25                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/
//* @Reference: https://www.youtube.com/watch?v=jD7FnbI76Hg - Realtime Chat With Users & Rooms - Socket.io, Node & Express

const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function getUserByUsername(username) {
  return users.find((user) => parseInt(user.username) === parseInt(username));
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  getUserByUsername,
  userLeave,
  getRoomUsers,
};
