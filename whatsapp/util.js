/*##############################################################################
# File: util.js                                                                #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-03-13 16:32:26                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-14 22:31:18                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const Sessions = require('../database/models/sessions');

module.exports = class Session {
  static session = new Array();

  static checkAddUser(name) {
    var checkFilter = this?.session?.filter((order) => order?.session === name),
      add = null;
    if (!checkFilter?.length) {
      add = {
        session: name,
      };
      this?.session?.push(add);
      return true;
    }
    return false;
  }

  static checkSession(name) {
    var checkFilter = this.session?.filter((order) => order?.session === name);
    if (checkFilter?.length) {
      return true;
    }
    return false;
  }

  static addInfoSession(name, extend) {
    for (var i in this?.session) {
      if (this?.session[i]?.session === name) {
        Object?.assign(this?.session[i], extend);
        return true;
      } else {
        return false;
      }
    }
  }

  static removeInfoObjects(name, key) {
    if (this.checkSession(name)) {
      for (var i in this.session) {
        if (this.session[i]?.session === name) {
          delete this.session[i][key];
          return true;
        }
      }
    }
    return false;
  }

  static getSessionInArray(name) {
    for (var i in this?.session) {
      if (this?.session[i]?.session === name) {
        return this?.session[i];
      }
    }
  }

  static getSessionKey(name) {
    if (this.checkSession(name)) {
      for (var i in this.session) {
        if (this.session[i]?.session === name) {
          return i;
        }
      }
    }
    return false;
  }

  static getSession(name) {
    for (var i in this?.session) {
      if (this?.session[i]?.session === name) {
        return this?.session[i];
      }
    }
  }

  static deleteSession(name) {
    if (this.checkSession(name)) {
      var key = this.getSessionKey(name);
      delete this.session[key];
      return true;
    }
    return false;
  }

  static async deleteSessionDB(nome) {
    Sessions.destroy({
      where: {
        nome: nome,
      },
    });
  }

  static async getAllSessionsDB() {
    Sessions.findAll();
  }
};
