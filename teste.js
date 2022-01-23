const Apoiador = require('./database/models/apoiador');
const empresa = require('./database/models/empresa');
const tipoApoiador = require('./database/models/tipoApoiador');
const { Op, QueryTypes } = require('sequelize');
const { db } = require('./routers/index');
const config = require('./config');

(async () => {
  console.log(config.api_url);
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
        attributes: ['descricao'],
      },
    ],
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

$(document).ready(function () {
  $('#reload').click(function () {
    $.ajax({
      url: '/ajax/arrays.txt',
      success: function (json) {
        //parse JSON data
        var data = JSON.parse(json);

        //Get Datatable API
        var table = $('#example').DataTable();

        //Clear the table
        table.clear();

        //Row data array is in 'data' object
        //Add the data array 'data.data' and redraw the table
        table.rows.add(data.data).draw();
      },
    });
  });

  $('#example').DataTable({
    data: [
      [
        'John Smith',
        'System Architect',
        'Seattle',
        '9999',
        '2013/03/22',
        '$520,800',
      ],
    ],
  });
});

function contact() {
  $.ajax({
    type: 'post',
    data: {
      ApoiadorId: document.getElementById('apoiador').value,
    },
    url: '/disparos/contatos',
    dataType: 'json',
    success: function (data) {
      table.clear();
      table.rows.add(data.data).draw();

      $('#contato').DataTable({
        data: [
          [
            'John Smith',
            'System Architect',
            'Seattle',
            '9999',
            '2013/03/22',
            '$520,800',
          ],
        ],
      });
    },
    error: function (data) {
      $('#contato').text('Error!');
    },
  });
}

function contact() {
  $.ajax({
    type: 'post',
    data: {
      ApoiadorId: document.getElementById('apoiador').value,
    },
    url: '/disparos/contatos',
    dataType: 'json',
    success: function (data) {
      data.forEach((element) => {
        console.log(element);
      });
      var data1 = JSON.stringify(data);
      alert(data1);
      var table = $('#contato').DataTable();
      table.clear();
      table.rows.add(data1).draw();

      $('#contato').DataTable({
        data: [
          [
            data1.id,
            data1.nome,
            data1.whatsapp,
            data1.email,
            data1.endereco,
            data1.ApoiadorId,
          ],
        ],
      });
    },
    error: function (data) {
      $('#contato').text('Error!');
    },
  });
}

function contact() {
  var example_table = $('#contato').DataTable({
    ajax: {
      type: 'POST',
      url: '/disparos/contatos',
      data: function (d) {
        d.ApoiadorId = document.getElementById('apoiador').value;
      },
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'nome' },
      { data: 'whatsapp' },
      { data: 'email' },
      { data: 'ApoiadorId' },
    ],
  });

  example_table.ajax.reload();
}

function smschange() {
  $.ajax({
    type: 'post',
    data: {
      EmpresaId: document.getElementById('empresa').value,
      tipoApoiadorId: document.getElementById('tipoApoiador').value,
    },
    url: '/disparos/apoiador',
    dataType: 'json',
    success: function (res) {
      $('#apoiador').empty();
      $('#apoiador').append('<option value="">SELECIONE</option>');
      res.forEach((element) => {
        $('#apoiador').append(
          '<option value="' + element.id + '">' + element.nome + '</option>'
        );
      });
    },
    error: function (res) {
      $('#apoiador').text('Error!');
    },
  });
}

function msgchange() {
  $.ajax({
    type: 'post',
    data: {
      id: document.getElementById('mensagem').value,
    },
    url: '/disparos/mensagens',
    dataType: 'json',
    success: function (res) {
      $('#displayMsg').empty();
      $('#displayMsg').append(JSON.stringify(res[0].body));
    },
    error: function (res) {
      $('#displayMsg').text('Error!');
    },
  });
}

function contact() {
  var table = $('#contato').DataTable({
    ajax: {
      type: 'POST',
      url: '/disparos/contatos',
      data: function (d) {
        d.ApoiadorId = document.getElementById('apoiador').value;
      },
      dataSrc: '',
    },
    columns: [
      { data: 'id' },
      { data: 'nome' },
      { data: 'whatsapp' },
      { data: 'email' },
      { data: 'ApoiadorId' },
    ],
  });

  table.ajax.reload();
}

function confirmDeletar(event, form) {
  event.preventDefault();
  Swal.fire({
    title: 'Você tem certeza?',
    text: 'Você não será capaz de reverter isso!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, delete!',
  }).then((result) => {
    if (result.isConfirmed) {
      form.submit();
      Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
    }
  });
}
