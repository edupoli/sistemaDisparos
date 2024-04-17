// migration-name: create-mensagem.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Mensagens',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        titulo: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        body: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        img: {
          type: Sequelize.STRING,
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
    await queryInterface.dropTable('Mensagens');
  },
};
