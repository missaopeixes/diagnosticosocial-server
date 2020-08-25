
import { MaxLength, IsDefined } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

export class OpcaoResposta extends BaseModel {

  @IsDefined({message: 'O campo descrição é obrigatório.'})
  @MaxLength(255, {message: 'O descrição deve ter no máximo 255 caracteres.'})
  descricao: string;

  constructor(descricao: string){
    super();
    this.descricao = descricao;
  }
}