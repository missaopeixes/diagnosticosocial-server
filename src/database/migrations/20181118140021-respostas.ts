import {
  QueryInterface,
  SequelizeStatic
} from 'sequelize';

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
      return queryInterface.createTable('respostas', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
          },

          idQuestionarioRespondido: {
              type: Sequelize.INTEGER,
              references: {
                  model: 'questionariosRespondidos',
                  key: 'id'
              },
              onDelete: 'CASCADE',
              allowNull: false
          },

          idPergunta: {
            type: Sequelize.INTEGER,
            references: {
                model: 'perguntas',
                key: 'id',
            },
            allowNull: false
          },

          idOpcaoEscolhida: {
            type: Sequelize.INTEGER,
            references: {
                model: 'opcoesResposta',
                key: 'id',
            },
            allowNull: true
          },

          respostaEmTexto: {
            allowNull: true,
            type: Sequelize.STRING
          },

          respostaEmNumero: {
            allowNull: true,
            type: Sequelize.DECIMAL
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
      return queryInterface.dropTable('respostas');
  }
};
