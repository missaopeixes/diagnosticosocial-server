import {
  Sequelize,
  DataTypes
} from 'sequelize';

export interface QuestionariosRespondidosAttributes {

  id : number;
  idEntrevista : number;
  idQuestionario : number;
  observacoes : string;
}

export interface QuestionariosRespondidosInstance {
  id: number;
  idEntrevista : number;
  idQuestionario : number;
  observacoes : string;

  createdAt: Date;
  updatedAt: Date;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
  var questionariosRespondidos = sequelize.define('questionariosRespondidos', {
      idEntrevista : DataTypes.INTEGER,
      idQuestionario : DataTypes.INTEGER,
      observacoes: DataTypes.STRING({ length: 500 })
  });

  questionariosRespondidos.associate = function(models) {

    questionariosRespondidos.hasMany(models.respostas, { 
      as: 'respostas',
      foreignKey: 'idQuestionarioRespondido'
    });
  }

  return questionariosRespondidos;
};
