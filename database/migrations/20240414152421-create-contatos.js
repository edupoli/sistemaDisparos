'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Contatos',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        nome: {
          type: Sequelize.STRING,
        },
        whatsapp: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
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
        img: {
          type: Sequelize.BLOB,
        },
        observacao: {
          type: Sequelize.STRING,
        },
        ApoiadorId: {
          type: Sequelize.INTEGER,
          references: { model: 'Apoiadores', key: 'id' },
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

    // Adicionar índice único composto para whatsapp e ApoiadorId
    await queryInterface.addIndex('Contatos', ['whatsapp', 'ApoiadorId'], {
      unique: true,
      name: 'unique_whatsapp_per_apoiador',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contatos');
  },
};
