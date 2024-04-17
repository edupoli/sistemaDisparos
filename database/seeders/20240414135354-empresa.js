'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Empresas',
      [
        {
          id: 1,
          nome: 'Grafica Valadao',
          contato: 'Syllas',
          cep: '86025510',
          telefone: '3192567455',
          celular: '3192567455',
          endereco: '',
          numero: '',
          bairro: '',
          cidade: '',
          uf: '',
          observacoes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
