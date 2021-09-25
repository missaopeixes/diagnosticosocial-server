import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface EventosAttributes {
    id : number;
    nome ? : string;
    idOrganizacao: number

}

export interface EventosInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    nome: string;
    idOrganizacao: number

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var eventos = sequelize.define('eventos', {
        nome: DataTypes.STRING,
        idOrganizacao: DataTypes.INTEGER
    });

    eventos.associate = function(models) {
        eventos.hasMany(models.eventosQuestionarios, { 
            as: 'questionarios',
            foreignKey: 'idEvento'
        });
    };

    return eventos;
};
