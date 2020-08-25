import {
  QueryInterface,
  SequelizeStatic
} from 'sequelize';

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
      return queryInterface.createTable('questionariosRespondidos', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
          },

          idEntrevista: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'entrevistas',
                  key: 'id'
              },
              onDelete: 'CASCADE',
              allowNull: false
          },

          idQuestionario: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'questionarios',
                  key: 'id',
              },
              allowNull: false
          },

          observacoes: {
            allowNull: true,
            type: Sequelize.STRING({length: 500})
          },

          createdAt: {
              allowNull: false,
              type: Sequelize.DATE
          },

          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
          }
      });
  },

  down: (queryInterface: QueryInterface) => {
      return queryInterface.dropTable('questionariosRespondidos');
  }
};
