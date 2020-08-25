import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface QuestionarioPerguntasAttributes {
    idQuestionario ? : number
    idPergunta ? : number
    ordem ? : number
}

export interface QuestionarioPerguntasInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    idQuestionario: number
    idPergunta: number
    ordem: number

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var questionarioPerguntas = sequelize.define('questionarioPerguntas', {
        idQuestionario: DataTypes.INTEGER,
        idPergunta: DataTypes.INTEGER,
        ordem: DataTypes.SMALLINT
    });

    questionarioPerguntas.associate = function(models) {
        // associations can be defined here
    };

    return questionarioPerguntas;
};
