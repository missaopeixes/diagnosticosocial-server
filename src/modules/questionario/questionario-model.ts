
import { MaxLength, IsDefined, IsNumber, IsString } from 'class-validator';
import { BaseModel } from '../../commom/base-model';
import { Pergunta } from '../pergunta/pergunta-model';
import { Resposta } from '../resposta/resposta-model';

export class Questionario extends BaseModel {

  @IsDefined({message: 'O campo nome é obrigatório.'})
  @MaxLength(100, {message: 'O nome deve ter no máximo 100 caracteres.'})
  nome: string;

  @IsDefined({message: 'O campo perguntas é obrigatório.'})
  perguntas: Pergunta[];

  constructor(nome: string, perguntas?: Pergunta[]){
    super();
    this.nome = nome;
    this.perguntas = perguntas || [];
  }
}

export class QuestionarioRespondido extends BaseModel {

  @IsNumber()
  idEntrevista: number;
  @IsNumber()
  idQuestionario: number;

  @MaxLength(500, {message: 'O campo observações deve ter no máximo 500 caracteres.'})
  @IsString({message: 'O campo observações deve conter um texto.'})
  observacoes: string;

  respostas: Resposta[];

  constructor(idEntrevista: number, idQuestionario: number, respostas?: Resposta[], observacoes?: string, id?: number){
    super();
    this.idEntrevista = idEntrevista;
    this.idQuestionario = idQuestionario;
    this.observacoes = observacoes ? observacoes : '';
    this.respostas = respostas || [];
    if (id) {
      this.id = id;
    }
  }
}