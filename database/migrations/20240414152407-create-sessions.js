// migration-name: create-sessions.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Sessions',
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
        clientID: {
          type: Sequelize.STRING,
        },
        empresaId: {
          type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Sessions');
  },
};
