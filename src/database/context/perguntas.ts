import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface PerguntasAttributes {
    descricao ? : string;
    tipoResposta ? : number;
    id: number;
}

export interface PerguntasInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    descricao: string;
    tipoResposta: number;
}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var perguntas = sequelize.define('perguntas', {
        descricao: DataTypes.STRING,
        tipoResposta: DataTypes.SMALLINT
    });

    perguntas.associate = function(models) {
        // associations can be defined here
        perguntas.belongsToMany(models.questionarios, { 
            through: 'questionarioPerguntas', 
            as: 'questionarios',
            foreignKey: 'idPergunta'
        });

        perguntas.belongsToMany(models.opcoesResposta, { 
            through: 'perguntasOpcoesResposta', 
            as: 'opcoesResposta',
            foreignKey: 'idPergunta'
        });
    };

    return perguntas;
};
