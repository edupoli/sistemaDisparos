'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Empresas',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        nome: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
            len: [3, 255],
          },
        },
        contato: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        cep: {
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
          type: Sequelize.STRING,
        },
        numero: {
          type: Sequelize.STRING,
        },
        bairro: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        cidade: {
          type: Sequelize.STRING,
        },
        uf: {
          type: Sequelize.STRING,
        },
        observacoes: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Empresas');
  },
};
