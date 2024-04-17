// migration-name: create-tipo-apoiador.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'tipoApoiador',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        descricao: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
            len: [3, 255],
          },
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
    await queryInterface.dropTable('tipoApoiador');
  },
};
