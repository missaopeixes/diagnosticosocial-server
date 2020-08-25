"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('entrevistas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            concluida: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            nome: {
                allowNull: true,
                type: Sequelize.STRING({ length: 100 })
            },
            idEvento: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'eventos',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                allowNull: false
            },
            idUsuario: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'usuarios',
                    key: 'id',
                },
                allowNull: false
            },
            observacoes: {
                allowNull: true,
                type: Sequelize.STRING({ length: 500 })
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
        return queryInterface.dropTable('entrevistas');
    }
};
