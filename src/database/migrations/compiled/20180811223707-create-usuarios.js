"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('usuarios', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nome: {
                type: Sequelize.STRING(100)
            },
            login: {
                type: Sequelize.STRING(100)
            },
            senha: {
                type: Sequelize.STRING
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
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('usuarios');
    }
};
