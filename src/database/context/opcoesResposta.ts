import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface OpcoesRespostaAttributes {
    descricao ? : string;
    id: number;
    idOrganizacao: number;
  }
  
  export interface OpcoesRespostaInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    
    descricao: string;
    idOrganizacao: number;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var opcoesResposta = sequelize.define('opcoesResposta', {
        descricao: DataTypes.STRING,
        idOrganizacao: DataTypes.INTEGER
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
