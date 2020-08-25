"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('usuarios', 'email', {
            type: Sequelize.STRING(100)
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn('usuarios', 'email');
    }
};
