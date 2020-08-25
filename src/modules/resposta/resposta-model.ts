import { MaxLength, IsDefined } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

export class Resposta extends BaseModel {

  // @IsDefined({message: 'É obrigatório definir a entrevista.'})
  // idEntrevista: number;
  id: number;
  idQuestionarioRespondido: number;

  @IsDefined({message: 'É obrigatório definir a pergunta.'})
  idPergunta: number;

  idOpcaoEscolhida: number;
  respostaEmTexto: string;
  respostaEmNumero: number;

  @MaxLength(500, {message: 'O campo observações deve ter no máximo 500 caracteres.'})
  observacoes: string;

  constructor() {
    super();
  }
}