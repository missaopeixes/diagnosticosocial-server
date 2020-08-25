import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface EventosQuestionariosAttributes {
    idEvento ? : number
    idQuestionario ? : number
    quantidadePorEnquete ? : number
    ordem ? : number
}

export interface EventosQuestionariosInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    idEvento: number
    idQuestionario: number
    quantidadePorEnquete: number
    ordem: number
}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var eventosQuestionarios = sequelize.define('eventosQuestionarios', {
        idEvento: DataTypes.INTEGER,
        idQuestionario: DataTypes.INTEGER,
        quantidadePorEnquete: DataTypes.SMALLINT,
        ordem: DataTypes.SMALLINT
    });

    eventosQuestionarios.associate = function(models) {
        // associations can be defined here
    };

    return eventosQuestionarios;
};
