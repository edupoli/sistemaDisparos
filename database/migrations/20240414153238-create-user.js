'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
            len: [3, 255],
          },
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true,
          validate: {
            notEmpty: true,
            isEmail: true,
          },
        },
        username: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
            len: [3, 25],
          },
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true,
          },
        },
        perfil: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        cargo: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        img: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal(
            'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
          ),
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
