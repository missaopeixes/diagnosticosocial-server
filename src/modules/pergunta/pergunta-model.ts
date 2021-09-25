
import { MaxLength, IsDefined, IsInt } from 'class-validator';
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
  
  @IsInt({message: 'O campo idOrganizacao deve conter um número inteiro.'})
  idOrganizacao: number;

  constructor(descricao: string, tipo: TipoResposta = TipoResposta.MultiplaEscolha, opcoes: OpcaoResposta[] = [], idOrganizacao: number){
    super();
    this.descricao = descricao;
    this.tipoResposta = tipo;
    this.opcoesResposta = opcoes;
    this.idOrganizacao = idOrganizacao;
  }

  possuiOpcoes() : boolean {
    switch (this.tipoResposta) {
      case TipoResposta.MultiplaEscolha:
      case TipoResposta.MultiplaSelecao:
        return true;
      default:
        return false;
    }
  }
}