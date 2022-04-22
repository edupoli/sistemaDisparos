const Sequelize = require('sequelize');
const connection = require('../database');

const User = connection.define('User', {
  name: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Campo Nome não pode ser vazio',
      },
      len: {
        args: [3, 255],
        msg: 'Nome deve ter entre 3 a 255 caracteres',
      },
    },
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'Esse e-mail já esta cadastrado, por favor use outro',
    },
    validate: {
      notEmpty: {
        msg: 'Campo e-mail não pode ser vazio',
      },
      isEmail: {
        msg: 'Email inválido',
      },
    },
  },
  username: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Campo Login não pode ser vazio',
      },
      len: {
        args: [3, 25],
        msg: 'Login deve ter entre 3 a 25 caracteres',
      },
    },
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: 'Campo Passwod não pode ser vazio',
      },
    },
  },
  perfil: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  cargo: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  img: {
    allowNull: false,
    type: Sequelize.STRING,
  },
});

//force: true faz com que a tabela seja criada ou atualizada no BD
// User.sync({ force: true })
//   .then(() => {
//     console.log('tabela criada/atualizada com sucesso no BD');
//   })
//   .catch((error) => {
//     console.log('erro ao sincronizar a tabela no BD', error);
//   });

module.exports = User;
