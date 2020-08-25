"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('perguntasOpcoesResposta', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            idPergunta: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'perguntas',
                    key: 'id'
                },
                allowNull: false
            },
            idOpcaoResposta: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'opcoesResposta',
                    key: 'id',
                },
                allowNull: false
            },
            ordem: {
                allowNull: false,
                type: Sequelize.SMALLINT
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
    down: (queryInterface) => {
        return queryInterface.dropTable('perguntasOpcoesResposta');
    }
};
