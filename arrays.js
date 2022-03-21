// // /*##############################################################################
// // # File: arrays.js                                                              #
// // # Project: template-sistema                                                    #
// // # Created Date: 2022-01-30 20:08:21                                            #
// // # Author: Eduardo Policarpo                                                    #
// // # Last Modified: 2022-01-30 20:27:14                                           #
// // # Modified By: Eduardo Policarpo                                               #
// // ##############################################################################*/

// // ARRAY QUE CONTEM OS NUMEROS QUE SERAM ENVIADOS AS MENSAGENS
// let contatos = [
//   {
//     number: '553291602726',
//     sender: false,
//   },
//   {
//     number: '553298168507',
//     sender: false,
//   },
//   {
//     number: '552193692967',
//     sender: false,
//   },
//   {
//     number: '5515988033533',
//     sender: false,
//   },
//   {
//     number: '553299492730',
//     sender: false,
//   },
//   {
//     number: '553299398505',
//     sender: false,
//   },
//   {
//     number: '553299400585',
//     sender: false,
//   },
//   {
//     number: '553298370580',
//     sender: false,
//   },
//   {
//     number: '553299186139',
//     sender: false,
//   },
//   {
//     number: '554499374078',
//     sender: false,
//   },
//   {
//     number: '553299076455',
//     sender: false,
//   },
//   {
//     number: '5515997989826',
//     sender: false,
//   },
// ];

// // ARRAY QUE CONTEM AS SESSÕES ATIVAS QUE SERÃO USADAS NOS ENVIOS
// let sessoes = [
//   { name: 'instancia-01' },
//   { name: 'instancia-02' },
//   { name: 'instancia-03' },
// ];

// // TOTAL DE SESSÕES
// let qtd_Sessoes = sessoes.length;
// // TOTAL DE CONTATOS
// let qtd_contatos = contatos.length;
// // QUANTIDADE DE MENSAGENS QUE CADA SESSÃO ENVIARÁ AQUI USANDO A FUNÇÃO MATH ROUND PARA FAZER O ARREDONDAMENTO EM CASO DE NUMERO QUEBRADO
// let qtda_Msg_Por_Sessao = Math.round(qtd_contatos / qtd_Sessoes);

// // VARIAVEL DE CONTROLE

// for (let x = 0; x < contatos.length; x++) {
//   let enviado = 0;
//   for (let y = 0; y < sessoes.length; y++) {
//     if (enviado === y && contatos[x].sender === false) {
//       console.log(
//         '👉 Instancia: ' +
//           sessoes[y].name +
//           ' Enviando para o numero: ' +
//           contatos[x].number +
//           '. \n ✅ Enviado.'
//       );
//     }
//     //enviado++;
//     contatos[y].sender = true;
//     if (enviado === sessoes.length - 1) {
//       enviado = 0;
//     }
//   }
// }

// // let sessoes = [
// //   { name: 'instancia-01', used_at: '2022-01-30 21:40:02' },
// //   { name: 'instancia-02', used_at: '2022-01-30 21:32:02' },
// //   { name: 'instancia-03', used_at: '2022-01-30 21:50:02' },
// // ];

// // let contatos = [
// //   { number: '553291602726', sender: false },
// //   { number: '553298168507', sender: false },
// //   { number: '552193692967', sender: false },
// //   { number: '553299186139', sender: false },
// // ];

// // function randomGet(data) {
// //   return data[Math.floor(Math.random() * data?.length)];
// // }

// // const randomSession = randomGet(sessoes);
// // const randomContato = randomGet(contatos);

// // const today = new Date();
// // const usedAtMinute = parseInt(
// //   (Math.abs(new Date(randomSession?.used_at).getTime() - today.getTime()) /
// //     (1000 * 60)) %
// //     60
// // );

// // console.log(
// //   `Sessao: ${randomSession?.name} | Numero: ${randomContato?.number}`
// // );
// // console.log(
// //   `A sessão: ${randomSession?.name} foi usada à ${usedAtMinute} minutos`
// // );

// // // aqui você usa a logica de envio....
// // if (parseInt(usedAtMinute) <= '29') {
// //   // aqui você envia a msg
// //   console.log(`Usando a sessão: ${randomSession?.name}`);
// //   console.log(`Disparando para... ${randomContato?.number}`);
// // } else {
// //   randomGet(sessoes);
// //   console.log(
// //     `Sessão ${randomSession?.name} utilizada recente, buscando outra...`
// //   );
// // }

// // console.log('--------------------------------');

// for (let x = 0; x < contatos.length; x++) {
//   let controle = 0;
//   for (let y = 0; y < sessoes.length; y++) {
//     if (y == controle) {
//       console.log(
//         '👉 Instancia: ' +
//           sessoes[y].name +
//           ' Enviando para o numero: ' +
//           contatos[x].number +
//           '. \n ✅ Enviado.'
//       );
//       //console.log(sessoes[y].name);
//       controle++;
//     }
//     if (controle === sessoes.length) {
//       controle = 0;
//     }
//   }
// }

/*##############################################################################
# File: arrays.js                                                              #
# Project: sistema-de-disparos                                                 #
# Created Date: 2022-01-30 20:08:21                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-03-14 22:07:09                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

// ARRAY QUE CONTEM OS NUMEROS QUE SERAM ENVIADOS AS MENSAGENS
let contatos = [
  {
    number: '553291602726',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '553298168507',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
  {
    number: '552193692967',
    sender: false,
  },
];

// ARRAY QUE CONTEM AS SESSÕES ATIVAS QUE SERÃO USADAS NOS ENVIOS
let sessoes = [
  { name: 'instancia-01' },
  { name: 'instancia-02' },
  { name: 'instancia-03' },
];

// TOTAL DE SESSÕES
let qtd_Sessoes = sessoes.length;
// TOTAL DE CONTATOS
let qtd_contatos = contatos.length;
// QUANTIDADE DE MENSAGENS QUE CADA SESSÃO ENVIARÁ AQUI USANDO A FUNÇÃO MATH ROUND PARA FAZER O ARREDONDAMENTO EM CASO DE NUMERO QUEBRADO
let qtda_Msg_Por_Sessao = Math.ceil(qtd_contatos / qtd_Sessoes);
//
console.log('\n');
console.log('TOTAL DE SESSÕES: ', qtd_Sessoes);
console.log('TOTAL DE CONTATOS: ', qtd_contatos);
console.log('QUANTIDADE DE MENSAGENS: ', qtda_Msg_Por_Sessao);
console.log('\n');
//
// VARIAVEL DE CONTROLE
let x = 0;
let y = 0;
let controle_y = qtda_Msg_Por_Sessao;
//
do {
  //
  console.log('Init sessao: ', sessoes[x].name);
  //
  do {
    //
    console.log(
      'Sessao: ',
      sessoes[x].name,
      'do numero: ',
      y,
      contatos[y].number
    );
    //
    y++;
    if (y == qtd_contatos) {
      controle_y = controle_y - 1;
    }
  } while (y < controle_y);
  controle_y += qtda_Msg_Por_Sessao;
  //
  console.log('--------------------------------------------------');
  //
  x++;
} while (x != qtd_Sessoes);
//
console.log('\n');
