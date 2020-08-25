'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {

    var now = new Date().toJSON().split('.')[0].replace('T', ' ');

    /**
     * Incluindo usuário administrador padrão.
    */
    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Administrador',
      login: 'admin',
      email: 'dev.missaopeixes@gmail.com',
      senha: '$2b$10$llBT2.2gv9IhpDiLhUzrJu6E.4hHHC6dxwurtguyqIv5bJDtrLf1u', // 1234
      createdAt: now,
      updatedAt: now
    }], {});
  },

  down: async (queryInterface, _Sequelize) => {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
