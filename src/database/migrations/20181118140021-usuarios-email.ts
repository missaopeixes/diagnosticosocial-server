import {
  QueryInterface,
  SequelizeStatic
} from 'sequelize';

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
      return queryInterface.addColumn('usuarios', 'email', {
          type: Sequelize.STRING(100)
      });
  },

  down: (queryInterface: QueryInterface) => {
      return queryInterface.removeColumn('usuarios', 'email');
  }
};
