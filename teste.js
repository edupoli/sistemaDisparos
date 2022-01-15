const Apoiador = require('./database/models/apoiador');
const empresa = require('./database/models/empresa');
const tipoApoiador = require('./database/models/tipoApoiador');
const { Op, QueryTypes } = require("sequelize");
const { db } = require('./routers/index');
const config = require('./config');



(async () => {

    console.log(config.api_url)
    Apoiador.findAll({
        raw: true,
        include: [
            {
                model: empresa,
                attributes: ['nome'],
                //as: 'emp'
            },
            {
                model: tipoApoiador,
                attributes: ['descricao']
            }
        ]
    }).then((result) => {
        console.log(result);
    });


    // let nu = 1
    // Apoiador.findAll({

    //     attributes: {
    //         exclude: ['createdAt', 'updatedAt']
    //     },
    //     include: [
    //         {
    //             model: Empresa,
    //             attributes: ['nome']
    //         },
    //         {
    //             model: tipoApoiador,
    //             attributes: ['descricao']
    //         }
    //     ]
    // }).then((value) => {
    //     //console.log(value[0].Empresa.nome)
    //     console.log(value.Apoiador.dataValues.nome)
    // })
})();


// [
//     Apoiador {
//       dataValues: {
//         id: 1,
//         nome: 'Eduardo Policarpo ',
//         whatsapp: '43 996611437',
//         telefone: '43 3329 0812',
//         cep: '86025510',
//         endereco: 'Rua Juruá',
//         numero: '356',
//         bairro: 'Jardim Agari',
//         cidade: 'Londrina',
//         uf: 'PR',
//         tipoApoiadorId: 1,
//         EmpresaId: 1,
//         Empresa: [Empresa],
//         tipoApoiador: [tipoApoiador]
//       },
//       _previousDataValues: {
//         id: 1,
//         nome: 'Eduardo Policarpo ',
//         whatsapp: '43 996611437',
//         telefone: '43 3329 0812',
//         cep: '86025510',
//         endereco: 'Rua Juruá',
//         numero: '356',
//         bairro: 'Jardim Agari',
//         cidade: 'Londrina',
//         uf: 'PR',
//         tipoApoiadorId: 1,
//         EmpresaId: 1,
//         Empresa: [Empresa],
//         tipoApoiador: [tipoApoiador]
//       },
//       _changed: Set(0) {},
//       _options: {
//         isNewRecord: false,
//         _schema: null,
//         _schemaDelimiter: '',
//         include: [Array],
//         includeNames: [Array],
//         includeMap: [Object],
//         includeValidated: true,
//         attributes: [Array],
//         raw: true
//       },
//       isNewRecord: false,
//       Empresa: Empresa {
//         dataValues: [Object],
//         _previousDataValues: [Object],
//         _changed: Set(0) {},
//         _options: [Object],
//         isNewRecord: false
//       },
//       tipoApoiador: tipoApoiador {
//         dataValues: [Object],
//         _previousDataValues: [Object],
//         _changed: Set(0) {},
//         _options: [Object],
//         isNewRecord: false
//       }
//     }
//   ]
