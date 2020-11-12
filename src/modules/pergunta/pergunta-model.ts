
import { MaxLength, IsDefined, IsNumber } from 'class-validator';
import { BaseModel } from '../../commom/base-model';
import { TipoResposta } from '../../commom/tipo-resposta';
import { OpcaoResposta } from '../opcaoResposta/opcaoResposta-model';

export class OpcaoDaPergunta {
  ordem: number
  idOpcaoResposta: number
};

export class Pergunta extends BaseModel {

  id: number;

  @IsDefined({message: 'O campo descrição é obrigatório.'})
  @MaxLength(255, {message: 'O campo descrição deve ter no máximo 255 caracteres.'})
  descricao: string;

  @IsDefined({message: 'O campo tipo de resposta é obrigatório.'})
  tipoResposta: TipoResposta;

  opcoesResposta: OpcaoResposta[];

  constructor(descricao: string, tipo: TipoResposta = TipoResposta.MultiplaEscolha, opcoes: OpcaoResposta[] = []){
    super();
    this.descricao = descricao;
    this.tipoResposta = tipo;
    this.opcoesResposta = opcoes;
  }
}