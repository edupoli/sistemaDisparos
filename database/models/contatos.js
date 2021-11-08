const Sequelize = require('sequelize');
const connection = require('../database');
const Apoiador = require('./apoiador');

const Contatos = connection.define('Contatos', {
    nome: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'Campo Nome não pode ser vazio'
            }
        }
    },
    whatsapp: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    email: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: {
            args: true,
            msg: 'Esse e-mail já esta cadastrado, por favor use outro'
        },
        validate: {
            notEmpty: {
                msg: 'Campo e-mail não pode ser vazio'
            },
            isEmail: {
                msg: 'Email inválido'
            }
        }
    },
    cep: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    endereco: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    numero: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    bairro: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    cidade: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    uf: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    img: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    apoiador: {
        allowNull: true,
        type: Sequelize.STRING,
    }
});

Contatos.belongsTo(Apoiador)
//force: true faz com que a tabela seja criada ou atualizada no BD
// Contatos.sync({ force: true })
//     .then(() => { console.log('tabela criada/atualizada com sucesso no BD') })
//     .catch((error) => { console.log('erro ao sincronizar a tabela no BD', error) })

module.exports = Contatos;