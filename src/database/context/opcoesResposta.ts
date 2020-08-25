import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface OpcoesRespostaAttributes {
    descricao ? : string;
    id: number;
}

export interface OpcoesRespostaInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    descricao: string;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var opcoesResposta = sequelize.define('opcoesResposta', {
        descricao: DataTypes.STRING
    });

    opcoesResposta.associate = function(models) {
        // associations can be defined here
        opcoesResposta.belongsToMany(models.perguntas, {
            through: 'perguntasOpcoesResposta',
            as: 'perguntas',
            foreignKey: 'idOpcaoResposta'
        });
    };

    return opcoesResposta;
};
