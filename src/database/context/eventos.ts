import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface EventosAttributes {
    id : number;
    nome ? : string;

}

export interface EventosInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    nome: string;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var eventos = sequelize.define('eventos', {
        nome: DataTypes.STRING
    });

    eventos.associate = function(models) {
        eventos.hasMany(models.eventosQuestionarios, { 
            as: 'questionarios',
            foreignKey: 'idEvento'
        });
    };

    return eventos;
};
