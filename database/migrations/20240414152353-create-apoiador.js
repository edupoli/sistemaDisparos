// migration-name: create-apoiador.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Apoiadores',
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
        },
        whatsapp: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        telefone: {
          type: Sequelize.STRING,
        },
        cep: {
          type: Sequelize.STRING,
        },
        endereco: {
          type: Sequelize.STRING,
        },
        numero: {
          type: Sequelize.STRING,
        },
        bairro: {
          type: Sequelize.STRING,
        },
        cidade: {
          type: Sequelize.STRING,
        },
        uf: {
          type: Sequelize.STRING,
        },
        tipoApoiadorId: {
          type: Sequelize.INTEGER,
          references: { model: 'tipoApoiador', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        EmpresaId: {
          type: Sequelize.INTEGER,
          references: { model: 'Empresas', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
    await queryInterface.dropTable('Apoiadores');
  },
};
