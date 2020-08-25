"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('questionarioPerguntas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            idQuestionario: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'questionarios',
                    key: 'id'
                },
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
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('questionarioPerguntas');
    }
};
