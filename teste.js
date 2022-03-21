// const Apoiador = require('./database/models/apoiador');
// const empresa = require('./database/models/empresa');
// const tipoApoiador = require('./database/models/tipoApoiador');
// const { Op, QueryTypes } = require('sequelize');
// const { db } = require('./routers/index');
// const config = require('./config');

// (async () => {
//   console.log(config.api_url);
//   Apoiador.findAll({
//     raw: true,
//     include: [
//       {
//         model: empresa,
//         attributes: ['nome'],
//         //as: 'emp'
//       },
//       {
//         model: tipoApoiador,
//         attributes: ['descricao'],
//       },
//     ],
//   }).then((result) => {
//     console.log(result);
//   });

//   // let nu = 1
//   // Apoiador.findAll({

//   //     attributes: {
//   //         exclude: ['createdAt', 'updatedAt']
//   //     },
//   //     include: [
//   //         {
//   //             model: Empresa,
//   //             attributes: ['nome']
//   //         },
//   //         {
//   //             model: tipoApoiador,
//   //             attributes: ['descricao']
//   //         }
//   //     ]
//   // }).then((value) => {
//   //     //console.log(value[0].Empresa.nome)
//   //     console.log(value.Apoiador.dataValues.nome)
//   // })
// })();

// // [
// //     Apoiador {
// //       dataValues: {
// //         id: 1,
// //         nome: 'Eduardo Policarpo ',
// //         whatsapp: '43 996611437',
// //         telefone: '43 3329 0812',
// //         cep: '86025510',
// //         endereco: 'Rua Juruá',
// //         numero: '356',
// //         bairro: 'Jardim Agari',
// //         cidade: 'Londrina',
// //         uf: 'PR',
// //         tipoApoiadorId: 1,
// //         EmpresaId: 1,
// //         Empresa: [Empresa],
// //         tipoApoiador: [tipoApoiador]
// //       },
// //       _previousDataValues: {
// //         id: 1,
// //         nome: 'Eduardo Policarpo ',
// //         whatsapp: '43 996611437',
// //         telefone: '43 3329 0812',
// //         cep: '86025510',
// //         endereco: 'Rua Juruá',
// //         numero: '356',
// //         bairro: 'Jardim Agari',
// //         cidade: 'Londrina',
// //         uf: 'PR',
// //         tipoApoiadorId: 1,
// //         EmpresaId: 1,
// //         Empresa: [Empresa],
// //         tipoApoiador: [tipoApoiador]
// //       },
// //       _changed: Set(0) {},
// //       _options: {
// //         isNewRecord: false,
// //         _schema: null,
// //         _schemaDelimiter: '',
// //         include: [Array],
// //         includeNames: [Array],
// //         includeMap: [Object],
// //         includeValidated: true,
// //         attributes: [Array],
// //         raw: true
// //       },
// //       isNewRecord: false,
// //       Empresa: Empresa {
// //         dataValues: [Object],
// //         _previousDataValues: [Object],
// //         _changed: Set(0) {},
// //         _options: [Object],
// //         isNewRecord: false
// //       },
// //       tipoApoiador: tipoApoiador {
// //         dataValues: [Object],
// //         _previousDataValues: [Object],
// //         _changed: Set(0) {},
// //         _options: [Object],
// //         isNewRecord: false
// //       }
// //     }
// //   ]

// $(document).ready(function () {
//   $('#reload').click(function () {
//     $.ajax({
//       url: '/ajax/arrays.txt',
//       success: function (json) {
//         //parse JSON data
//         var data = JSON.parse(json);

//         //Get Datatable API
//         var table = $('#example').DataTable();

//         //Clear the table
//         table.clear();

//         //Row data array is in 'data' object
//         //Add the data array 'data.data' and redraw the table
//         table.rows.add(data.data).draw();
//       },
//     });
//   });

//   $('#example').DataTable({
//     data: [
//       [
//         'John Smith',
//         'System Architect',
//         'Seattle',
//         '9999',
//         '2013/03/22',
//         '$520,800',
//       ],
//     ],
//   });
// });

// function contact() {
//   $.ajax({
//     type: 'post',
//     data: {
//       ApoiadorId: document.getElementById('apoiador').value,
//     },
//     url: '/disparos/contatos',
//     dataType: 'json',
//     success: function (data) {
//       table.clear();
//       table.rows.add(data.data).draw();

//       $('#contato').DataTable({
//         data: [
//           [
//             'John Smith',
//             'System Architect',
//             'Seattle',
//             '9999',
//             '2013/03/22',
//             '$520,800',
//           ],
//         ],
//       });
//     },
//     error: function (data) {
//       $('#contato').text('Error!');
//     },
//   });
// }

// function contact() {
//   $.ajax({
//     type: 'post',
//     data: {
//       ApoiadorId: document.getElementById('apoiador').value,
//     },
//     url: '/disparos/contatos',
//     dataType: 'json',
//     success: function (data) {
//       data.forEach((element) => {
//         console.log(element);
//       });
//       var data1 = JSON.stringify(data);
//       alert(data1);
//       var table = $('#contato').DataTable();
//       table.clear();
//       table.rows.add(data1).draw();

//       $('#contato').DataTable({
//         data: [
//           [
//             data1.id,
//             data1.nome,
//             data1.whatsapp,
//             data1.email,
//             data1.endereco,
//             data1.ApoiadorId,
//           ],
//         ],
//       });
//     },
//     error: function (data) {
//       $('#contato').text('Error!');
//     },
//   });
// }

// function contact() {
//   var example_table = $('#contato').DataTable({
//     ajax: {
//       type: 'POST',
//       url: '/disparos/contatos',
//       data: function (d) {
//         d.ApoiadorId = document.getElementById('apoiador').value;
//       },
//       dataSrc: '',
//     },
//     columns: [
//       { data: 'id' },
//       { data: 'nome' },
//       { data: 'whatsapp' },
//       { data: 'email' },
//       { data: 'ApoiadorId' },
//     ],
//   });

//   example_table.ajax.reload();
// }

// function smschange() {
//   $.ajax({
//     type: 'post',
//     data: {
//       EmpresaId: document.getElementById('empresa').value,
//       tipoApoiadorId: document.getElementById('tipoApoiador').value,
//     },
//     url: '/disparos/apoiador',
//     dataType: 'json',
//     success: function (res) {
//       $('#apoiador').empty();
//       $('#apoiador').append('<option value="">SELECIONE</option>');
//       res.forEach((element) => {
//         $('#apoiador').append(
//           '<option value="' + element.id + '">' + element.nome + '</option>'
//         );
//       });
//     },
//     error: function (res) {
//       $('#apoiador').text('Error!');
//     },
//   });
// }

// function msgchange() {
//   $.ajax({
//     type: 'post',
//     data: {
//       id: document.getElementById('mensagem').value,
//     },
//     url: '/disparos/mensagens',
//     dataType: 'json',
//     success: function (res) {
//       $('#displayMsg').empty();
//       $('#displayMsg').append(JSON.stringify(res[0].body));
//     },
//     error: function (res) {
//       $('#displayMsg').text('Error!');
//     },
//   });
// }

// function contact() {
//   var table = $('#contato').DataTable({
//     ajax: {
//       type: 'POST',
//       url: '/disparos/contatos',
//       data: function (d) {
//         d.ApoiadorId = document.getElementById('apoiador').value;
//       },
//       dataSrc: '',
//     },
//     columns: [
//       { data: 'id' },
//       { data: 'nome' },
//       { data: 'whatsapp' },
//       { data: 'email' },
//       { data: 'ApoiadorId' },
//     ],
//   });

//   table.ajax.reload();
// }

// function confirmDeletar(event, form) {
//   event.preventDefault();
//   Swal.fire({
//     title: 'Você tem certeza?',
//     text: 'Você não será capaz de reverter isso!',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Sim, delete!',
//   }).then((result) => {
//     if (result.isConfirmed) {
//       form.submit();
//       Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
//     }
//   });
// }

// const axios = require('axios');

// (async () => {
//   // POST request using axios with async/await

//   const response = await axios.post('http://209.145.62.5:3333/getSessions');
//   console.log(response);
// })();

// {
//   result: 200,
//   sessions: [
//     {
//       id: '5515988033533@s.whatsapp.net',
//       session: '5515988033533@s.whatsapp.net',
//       authorization: '123@abcd',
//       webhook: 'LsuvQbjgLz98vOkO4k6VfQ==',
//       clientID: '1@BFkrB4QkbyIGHdm/2BQuYFGVGshXHZD5M7DzMDF4ogU4yzO2OldJDEzfLKbKWmcDH4OpIEdMX1okpw==',
//       serverToken: 'pOStK2r+xceXnWrHdJuyuN+zd5bJTFZceLoQEFfQ/oE=',
//       clientToken: 'ig97RBihGaOXeZo3D8Pzr0ItK/aGz7sxLhlEjXTt00o=',
//       encKey: 'wQXryKNoKXH9hx4TIwd0agdFfTXwakCPd4vv03Qz5/c='
//     },
//     {
//       id: '554399557904@s.whatsapp.net',
//       webhook: 'pL86HzCuDQUaa6vD6Q1gSg==',
//       clientID: '1@N9ITzs+huEC5cxRvgVL/RfuyCKNvRNI2O+eXAvgPtTFqmAgYLW5GTxTbpdQiqeHXjIP5yGiyEQK7Yg==',
//       serverToken: 'lVb9T2nKqceEFu2BjOOaLpQ+Q166jRK86LtpvZ41zOs=',
//       clientToken: 'FTltcKqLU4+8iazkPH7nq9kF1/2/cvhDXSwtZS1b1aw=',
//       encKey: 'BXElYBNSL3/BvYP0PArq1vxViO20FWxR8VoJh+t009U='
//     }
//   ]
// }

// var dados = [
//   '553291602726',
//   '553298168507',
//   '552193692967',
//   '553299492730',
//   '553299398505',
//   '553299400585',
//   '553298370580',
//   '553299186139',
//   '554499374078',
//   '553299076455',
//   '5515997989826',
//   '553291581313',
//   '553298753443',
//   '553298267850',
//   '553298015940',
//   '553299263616',
//   '5515997071375',
//   '553299168249',
//   '553299167021',
//   '553291611736',
//   '554399209552',
// ];

// var sessions = [
//   '5515988033533@s.whatsapp.net',
//   '554396611437@s.whatsapp.net',
//   '5543999557904@s.whatsapp.net',
// ];

// ('use strict');
// const extend = require('extend');
// const numbers = require('./numb');

// let numeros = [];
// let instancias = [];

// async function setupValores() {
//   // let numbers = [
//   //   { number: '5516997141457', sender: false },
//   //   { number: '5516997141211', sender: false },
//   //   { number: '5516997145450', sender: false },
//   //   { number: '5516997144455', sender: false },
//   //   { number: '5516997126657', sender: false },
//   //   { number: '5516997888357', sender: false },
//   //   { number: '5516997403489', sender: false },
//   //   { number: '5516997176448', sender: false },
//   // ];

//   extend(numeros, numbers);

//   let values = [
//     { name: 'instancia-01' } /* se esta sendo usada no momento para envio */,
//     { name: 'instancia-02' },
//     { name: 'instancia-03' },
//   ];

//   extend(instancias, values);

//   setSend();
// }

// const numeros = require('./numb');
// let sessao = [{ nome: 'eduardo' }, { nome: 'calcinha' }, { nome: 'sutia' }];

// // /* enviar mensagens de forma aleatoria enviar 5 mensagens por vez para cada sessão */
// async function setSend() {
//   let x = 0;
//   let y = 0;
//   let z = Math.ceil(numeros.length / sessao.length);
//   let w = Math.ceil(numeros.length / sessao.length);

//   do {
//     do {
//       console.log(
//         '👉 Instancia: ' +
//           sessao[x].nome +
//           ' Enviando para o numero: ' +
//           numeros[y].number +
//           '. \n ✅ Enviado.'
//       );

//       y++;
//       if (y == numeros.length) {
//         z--;
//       }
//     } while (y < z);
//     z += w;

//     x++;
//   } while (x != sessao.length);

// const envios = require('./whatsapp/envios');
// const whatsapp = require('./whatsapp/sessions');
// const Session = require('./whatsapp/util');
// const { MessageType } = require('@adiwajshing/baileys');

// let data = Session.getSessions('5515988033533@s.whatsapp.net');

// const Queue = require('bull');
// const valores = require('./numb');
// const workQueue = new Queue(`Apoiador`, {
//   redis: {
//     host: '127.0.0.1',
//     port: 6379,
//   },
//   limiter: {
//     max: 1,
//     duration: 5000,
//   },
// });

// function putQueue(phone) {
//   const dados = {
//     session: 'teste de fila',
//     phone: phone,
//     message: 'vou descobrir como isso funciona',
//   };

//   const options = {
//     delay: 1000, // 1 min in ms
//     attempts: 1,
//     age: 10,
//     count: 1,
//   };
//   // adiciona a fila
//   workQueue.add({ name: 'teste', data: dados, opts: options });
//   console.log('adiciona a fila');
// }

// // processa a fila chamando a função send
// workQueue.process(async (job, done) => {
//   console.log(job.data);
//   done();
//   return await send(job.data);
// });

// function send(data) {
//   console.log(data);
// }

// valores.forEach((item) => {
//   putQueue(item.number);
// });
const session = '5515988033533@s.whatsapp.net';

const Sessions = require('./database/models/sessions');
const Apoiador = require('./database/models/apoiador');
const Contatos = require('./database/models/contatos');
const Empresa = require('./database/models/empresa');
const tipoApoiador = require('./database/models/tipoApoiador');
const { Op } = require('sequelize');

// Apoiador.findAll({ attributes: attributes, raw: true }).then((apoiador) => {
//   console.table(apoiador);
// });

// Apoiador.findAll({
//   raw: true,
//   include: [
//     {
//       model: Empresa,
//       attributes: ['nome'],
//       required: true,
//     },
//   ],
// }).then((results) => {
//   let values = JSON.stringify(results);
//   console.log(JSON.parse(values));

//   // Object.keys(results[0]).map(function (key, values) {
//   //   console.log('A chave é: ' + key);
//   //   console.log('O valor é: ' + values);
//   // });
// });
var attributes = { exclude: ['createdAt', 'updatedAt'] };

Contatos.findAll({
  include: [
    {
      model: Apoiador,
      required: true,
      attributes: ['nome'],
    },
  ],
  order: [['id', 'ASC']],
}).then((results) => {
  results.forEach((result) => {
    console.log(result.Apoiador.nome);
  });

  //console.log(results[0].dataValues.Apoiador.nome);
});

// Apoiador.findAll()
//   .then((apoiador) => {
//     Empresa.findAll().then((empresa) => {
//       tipoApoiador.findAll().then((tipo) => {
//         console.log(apoiador, empresa, tipo);
//       });
//     });
//   })
//   .catch((error) => {
//     res.json('deu erro' + error);
//   });

//   (async () => {
//   let data = await Sessions.findAll({
//     where: { nome: { [Op.eq]: session } },
//   });
//   console.log(data.length);
// })();

//data.client.sendMessage('554396611437@s.whatsapp.net','teste', MessageType.text);

//envios.putQueue('5515988033533@s.whatsapp.net','554396611437@s.whatsapp.net','teste')
// console.log('adiciona a fila');
// numeros.length = 0;

// let contSender = numeros.length - 1; /* qtde de numeros q serem enviados */
// let contInsts = sessao.length - 1; /* qtde de instancias */
// let qtdePorInst = Math.ceil(numeros.length / sessao.length);
// let enviados = 0;
// console.log(qtdePorInst);
// /* laço de instancias */
// let x = 0;
// let y = 0;
// let controle_y = Math.ceil(numeros.length / sessoes.length);

// do {
//   do {} while (condition);

//   x++;
// } while (x < sessao.length);

// do {
//   console.log('Init sessao: ', sessoes[x].name);

//   do {
//     const data = {
//       session: sessoes[x].name,
//       to: numeros[y].number,
//       type: 'text',
//       recipient_type: 'individual',
//       text: {
//         body: mensagem[0].body,
//       },
//     };

//     const options = {
//       delay: 600, // 1 min in ms
//       attempts: 1,
//     };
//     // adiciona a fila
//     workQueue.add(data, options);

//     y++;
//     if (y == qtd_contatos) {
//       controle_y = controle_y - 1;
//     }
//   } while (y < controle_y);
//   controle_y += qtda_Msg_Por_Sessao;

//   x++;
// } while (x != qtd_Sessoes);

// for (var x = 0; x <= sessao.length - 1; x++) {
//   /* laço de numeros (a serem enviadas mensagens) */
//   for (var y = 0; y <= numeros.length - 1; y++) {
//     if (enviados < qtdePorInst && numeros[y].sender === false) {
//       /* simulação de envio de mensagem por instancia */

//       console.log(
//         '👉 Instancia: ' +
//           sessao[x].nome +
//           ' Enviando para o numero: ' +
//           numeros[y].number +
//           '. \n ✅ Enviado.'
//       );

//       enviados++;
//       numeros[y].sender = true;
//     }
//     if (enviados == qtdePorInst) {
//       enviados = 0;
//       continue;
//     }
//   }
// }

// console.log('\r Resumo de envios: ', numeros);
// }

// setSend();

//const numbers = require('./numb');

// let instancias = [
//   { name: 'instancia-01' },
//   { name: 'instancia-02' },
//   { name: 'instancia-03' },
// ];

// let qtdaNumeber = numeros.length - 1;
// let qtdaSessions = instancias.length - 1;
// let qtdaPorSession = qtdaNumeber / qtdaSessions;
// let enviados = 0;

// for (let i = 0; i <= instancias.length - 1; i++) {
//   console.log('sessão ', i);
//   for (let z = 0; z <= numeros.length - 1; z++) {
//     if (enviados <= 2 && numeros[z].sender == false) {
//       console.log(
//         //`Numero ${numeros[z].number} enviado pela Instancia ${instancias[i].name}`
//         console.log(
//           '👉 Instancia: ' +
//             instancias[i].name +
//             ' Enviando para o numero: ' +
//             numeros[z].number +
//             '. \n ✅ Enviado.'
//         )
//       );
//       enviados++;
//       numeros[z].sender = true;
//     } else {
//       enviados = 0;
//       continue;
//     }
//   }
// }
// console.log('qtda de numeros ', qtdaNumeber);
// console.log('qtda de sessões ', qtdaSessions);
// console.log('qtda de numeros por sessao ', qtdaPorSession);

//console.log(instancias.length);
//console.log(inst.length);

// let contSender = (numeros.length -1); /* qtde de numeros q serem enviados */
//     let contInsts = (instancias.length -1 ); /* qtde de instancias */
//     let qtdePorInst = (contSender / contInsts); /* qtde a ser enviada por instancia */
//     let enviados = 0;
//     /* laço de instancias */
//     for(var x = 0; x <= instancias.length -1; x++){

//         /* laço de numeros (a serem enviadas mensagens) */
//         for(var y = 0; y <= numeros.length -1; y++){

//             if(enviados <= 5 && numeros[y].sender == false){

//                 /* simulação de envio de mensagem por instancia */

//                 console.log("👉 Instancia: " + instancias[x].name + ' Enviando para o numero: ' + numeros[y].number + '. \n ✅ Enviado.');

//                 enviados++;
//                 numeros[y].sender = true;
//             }else{
//                 enviados = 0;
//                continue; /* pular para próxima instancia */
//             }
//         }

// ('use strict');
// const extend = require('extend');

// let numeros = [];
// let instancias = [];

// async function setupValores() {
//   // let numbers = [
//   //   { number: '5516997141457', sender: false },
//   //   { number: '5516997141211', sender: false },
//   //   { number: '5516997145450', sender: false },
//   //   { number: '5516997144455', sender: false },
//   //   { number: '5516997126657', sender: false },
//   //   { number: '5516997888357', sender: false },
//   //   { number: '5516997403489', sender: false },
//   //   { number: '5516997176448', sender: false },
//   // ];

//   extend(numeros, numbers);

//   let values = [
//     { name: 'instancia-01' } /* se esta sendo usada no momento para envio */,
//     { name: 'instancia-02' },
//     { name: 'instancia-03' },
//   ];

//   extend(instancias, values);

//   setSend();
// }

// /* enviar mensagens de forma aleatoria enviar 5 mensagens por vez para cada sessão */
// async function setSend() {
//   let contSender = numeros.length - 1; /* qtde de numeros q serem enviados */
//   let contInsts = instancias.length - 1; /* qtde de instancias */
//   let qtdePorInst =
//     contSender / contInsts; /* qtde a ser enviada por instancia */
//   let enviados = 0;
//   /* laço de instancias */
//   for (var x = 0; x <= instancias.length - 1; x++) {
//     console.log(instancias[x].name);
//     /* laço de numeros (a serem enviadas mensagens) */
//     for (var y = 0; y <= numeros.length - 1; y++) {
//       if (enviados <= 2 && numeros[y].sender == false) {
//         /* simulação de envio de mensagem por instancia */

//         console.log(
//           '👉 Instancia: ' +
//             instancias[x].name +
//             ' Enviando para o numero: ' +
//             numeros[y].number +
//             '. \n ✅ Enviado.'
//         );

//         enviados++;
//         numeros[y].sender = true;
//       } else {
//         enviados = 0;
//         continue; /* pular para próxima instancia */
//       }
//     }
//   }

//   console.log('\r Resumo de envios: ', numeros);
// }

// setupValores();

// let sessao = [{ nome: 'eduardo' }, { nome: 'calcinha' }, { nome: 'sutia' }];
// let qtdSessao = sessao.length;
// let qtdNumeber = numbers.length;
// let enviado = 0;

// for (let x = 0; x < sessao.length; x++) {
//   for (let y = 0; y < numbers.length; y++) {
//     if (enviado < 2 && numbers[y].sender === false) {
//       console.log('sessao: ', sessao[x].nome, 'do numero: ', numbers[y].number);
//       enviado++;
//       numbers[y].sender = true;
//     } else {
//       enviado = 0;
//       continue;
//     }
//   }
// }

// for (let x = 0; x < numbers.length; x++) {
//   for (let y = 0; y < sessao.length; y++) {
//     console.log(y);
//     if (sessao) {
//     }
//   }
// }
