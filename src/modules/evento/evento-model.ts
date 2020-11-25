import { MaxLength, IsDefined, IsString, IsNumber } from 'class-validator';
import { Is } from 'sequelize-typescript';
import { BaseModel } from '../../commom/base-model';
import { Questionario } from '../questionario/questionario-model';

export enum QtdQuestionarioPorEnquete {
  apenasUm = 1,
  peloMenosUm,
  opcional
};

export class QuestionarioDoEvento {
  idQuestionario: number;
  quantidadePorEnquete: QtdQuestionarioPorEnquete;
  ordem: number;
}

export class Evento extends BaseModel {

  @IsDefined({message: 'O campo nome é obrigatório.'})
  @MaxLength(255, {message: 'O campo nome deve ter no máximo 255 caracteres.'})
  @IsString({message: 'O campo nome deve conter um texto.'})
  nome: string;

  @IsDefined({message: 'O campo questionarios é obrigatório.'})
  questionarios: QuestionarioDoEvento[];

  constructor(nome: string, questionarios?: QuestionarioDoEvento[]){
    super();
    this.nome = nome;
    this.questionarios = questionarios || [];
  }
}

export class Cruzamento {

  idPerguntaUniverso: number = 1;
  idPerguntaAmostragem: number = 1;
  idQrUniverso: number = 1;
  idQrAmostragem: number = 1;
  idOpEscolhidaUniverso: number = 1;

  constructor(cruzamento?: Partial<Cruzamento>) {
    Object.assign(this, cruzamento);
  }

  /*
  constructor(idPerguntaUniverso: number, idPerguntaAmostragem: number, idQrUniverso: number, idQrAmostragem: number, idOpEscolhidaUniverso: number){
    this.idPerguntaUniverso = idPerguntaUniverso;
    this.idPerguntaAmostragem = idPerguntaAmostragem;
    this.idQrUniverso = idQrUniverso;
    this.idQrAmostragem = idQrAmostragem;
    this.idOpEscolhidaUniverso = idOpEscolhidaUniverso;
  }
  */
}