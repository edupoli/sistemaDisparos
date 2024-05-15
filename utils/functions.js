const fnSockets = require('../sockets/fnSockets');
const Apoiador = require('../database/models/apoiador');
const Contatos = require('../database/models/contatos');
const Sessions = require('../database/models/sessions');

const getSession = async (whatsapp) => {
  const session = await Sessions.findOne({
    where: { clientID: whatsapp },
  });
  return session ? session.get({ plain: true }) : null;
};
