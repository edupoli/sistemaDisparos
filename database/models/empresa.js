const Sequelize = require('sequelize');
const connection = require('../database');

const Empresa = connection.define('Empresa', {
    nome: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'Campo Nome não pode ser vazio'
            },
            len: {
                args: [3, 255],
                msg: 'Nome deve ter entre 3 a 255 caracteres'
            }
        }
    },
    contato: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: 'Campo Contato não pode ser vazio'
            }
        }
    },
    cep: {
        allowNull: true,
        type: Sequelize.STRING,
    },
    telefone: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    celular: {
        allowNull: false,
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
        allowNull: false,
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
    observacoes: {
        allowNull: true,
        type: Sequelize.STRING,
    }
});

//force: true faz com que a tabela seja criada ou atualizada no BD
// Empresa.sync({ force: true })
//     .then(() => { console.log('tabela criada/atualizada com sucesso no BD') })
//     .catch((error) => { console.log('erro ao sincronizar a tabela no BD', error) })

module.exports = Empresa;