
import { MaxLength, IsDefined } from 'class-validator';
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
  @MaxLength(255, {message: 'O nome deve ter no máximo 255 caracteres.'})
  nome: string;

  @IsDefined({message: 'O campo questionarios é obrigatório.'})
  questionarios: QuestionarioDoEvento[];

  constructor(nome: string, questionarios?: QuestionarioDoEvento[]){
    super();
    this.nome = nome;
    this.questionarios = questionarios || [];
  }
}