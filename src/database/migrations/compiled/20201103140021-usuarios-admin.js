"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('usuarios', 'administrador', {
            type: Sequelize.BOOLEAN
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn('usuarios', 'administrador');
    }
};
