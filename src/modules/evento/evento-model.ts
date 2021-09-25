
import { MaxLength, IsDefined, IsString, IsInt } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

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

  @IsInt({message: 'O campo idOrganizacao deve conter um número inteiro.'})
  idOrganizacao: number;

  constructor(nome: string, questionarios?: QuestionarioDoEvento[], idOrganizacao: number = 0){
    super();
    this.nome = nome;
    this.questionarios = questionarios || [];
    this.idOrganizacao = idOrganizacao;
  }
}