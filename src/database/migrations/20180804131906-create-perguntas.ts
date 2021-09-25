import {
    QueryInterface,
    SequelizeStatic
} from 'sequelize';

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.createTable('perguntas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            descricao: {
                type: Sequelize.STRING
            },

            tipoResposta: {
                allowNull: false,
                type: Sequelize.TINYINT
            },

            idOrganizacao: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'organizacoes',
                    key: 'id',
                },
                allowNull: false
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

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.dropTable('perguntas');
    }
};
