
import { MaxLength, IsDefined } from 'class-validator';
import { BaseModel } from '../../commom/base-model';
import { QuestionarioRespondido } from '../questionario/questionario-model';

export class Entrevista extends BaseModel {

  nome: string;
  idEvento: number;
  idUsuario: number;
  concluida: boolean;

  questionariosRespondidos: QuestionarioRespondido[];

  @MaxLength(500, {message: 'O campo observações deve ter no máximo 500 caracteres.'})
  observacoes: string;

  constructor(idEvento: number, idUsuario: number, nome?: string, respostas?: QuestionarioRespondido[], observacoes?: string, concluida?: boolean){
    super();

    this.idEvento = idEvento;
    this.idUsuario = idUsuario;
    this.concluida = false;
    this.nome = nome || '';
    this.questionariosRespondidos = respostas || [];
    this.observacoes = observacoes || '';
    this.concluida = concluida || false;
  }
}