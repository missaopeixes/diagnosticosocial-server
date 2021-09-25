import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface QuestionariosAttributes {
    nome ? : string;
    id: number;
    idOrganizacao: number;
}

export interface QuestionariosInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    nome: string;
    idOrganizacao: number;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var questionarios = sequelize.define('questionarios', {
        nome: DataTypes.STRING(100),
        idOrganizacao: DataTypes.INTEGER
    });

    questionarios.associate = (models) => { // param: models
        // associations can be defined here
        questionarios.belongsToMany(models.perguntas, { 
            through: 'questionarioPerguntas', 
            as: 'perguntas',
            foreignKey: 'idQuestionario'
        });
    };

    return questionarios;
};
