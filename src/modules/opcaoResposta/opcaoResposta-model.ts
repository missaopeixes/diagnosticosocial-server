
import { MaxLength, IsDefined, IsInt } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

export class OpcaoResposta extends BaseModel {

  @IsDefined({message: 'O campo descrição é obrigatório.'})
  @MaxLength(255, {message: 'O campo descrição deve ter no máximo 255 caracteres.'})
  descricao: string;

  @IsInt({message: 'O campo idOrganizacao deve conter um número inteiro.'})
  idOrganizacao: number;

  constructor(descricao: string, idOrganizacao: number){
    super();
    this.descricao = descricao;
    this.idOrganizacao = idOrganizacao;
  }
}