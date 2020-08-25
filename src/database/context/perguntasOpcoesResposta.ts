import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface PerguntasOpcoesRespostaAttributes {
    idPergunta ? : number
    idOpcaoResposta ? : number
    ordem ? : number

}

export interface PerguntasOpcoesRespostaInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    idPergunta: number
    idOpcaoResposta: number
    ordem: number

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var perguntasOpcoesResposta = sequelize.define('perguntasOpcoesResposta', {
        idPergunta: DataTypes.INTEGER,
        idOpcaoResposta: DataTypes.INTEGER,
        ordem: DataTypes.SMALLINT
    });

    perguntasOpcoesResposta.associate = function(models) {
        // associations can be defined here
    };

    return perguntasOpcoesResposta;
};
