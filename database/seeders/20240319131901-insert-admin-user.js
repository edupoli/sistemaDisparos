'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          name: 'Administrador do Sistema',
          email: 'edu.policarpo@gmail.com',
          username: 'admin',
          password:
            '$2a$10$NvFy6RRwAowdFfT8YgGEr.PHxuEHMLAmu9c3knmSkTSJuZWEy7VJ2',
          perfil: 'administrador',
          cargo: 'Administrador',
          img: 'IMG_20220205_134218.jpeg',
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
