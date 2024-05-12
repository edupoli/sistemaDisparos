/*##############################################################################
# File: util.js                                                                #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 16:32:26                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-14 22:31:18                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

module.exports = class Session {
  static sessionMap = new Map();

  static checkAddUser(name) {
    if (!this.sessionMap.has(name)) {
      this.sessionMap.set(name, { session: name });
      return true;
    }
    return false;
  }

  static addInfoSession(name, extend) {
    if (this.sessionMap.has(name)) {
      let session = this.sessionMap.get(name);
      Object.assign(session, extend);
      return true;
    }
    return false;
  }

  static getSession(name) {
    return this.sessionMap.get(name);
  }

  static deleteSession(name) {
    return this.sessionMap.delete(name);
  }

  static async deleteSessionDB(nome) {
    return Sessions.destroy({
      where: {
        nome: nome,
      },
    });
  }

  static async getAllSessionsDB() {
    return Sessions.findAll();
  }
};
