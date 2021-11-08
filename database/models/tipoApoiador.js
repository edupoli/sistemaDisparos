const Sequelize = require('sequelize');
const connection = require('../database');

const tipoApoiador = connection.define('tipoApoiador', {
    descricao: {
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
    }
});

//force: true faz com que a tabela seja criada ou atualizada no BD
// tipoApoiador.sync({ force: true })
//     .then(() => { console.log('tabela criada/atualizada com sucesso no BD') })
//     .catch((error) => { console.log('erro ao sincronizar a tabela no BD', error) })

module.exports = tipoApoiador;