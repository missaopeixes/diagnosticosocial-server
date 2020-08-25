import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface RespostasAttributes {

    id : number;
    idQuestionarioRespondido : number;
    idPergunta : number;
    idOpcaoEscolhida : number;
    respostaEmTexto : string;
    respostaEmNumero : number;
    observacoes : string;
}

export interface RespostasInstance {
    id: number;
    idQuestionarioRespondido : number;
    idPergunta : number;
    idOpcaoEscolhida : number;
    respostaEmTexto : string;
    respostaEmNumero : number;
    observacoes : string;

    createdAt: Date;
    updatedAt: Date;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var respostas = sequelize.define('respostas', {
        idQuestionarioRespondido : DataTypes.INTEGER,
        idPergunta : DataTypes.INTEGER,
        idOpcaoEscolhida : DataTypes.INTEGER,
        respostaEmTexto : DataTypes.STRING,
        respostaEmNumero : DataTypes.DECIMAL,
        observacoes: DataTypes.STRING({ length: 500 })
    });

    return respostas;
};
