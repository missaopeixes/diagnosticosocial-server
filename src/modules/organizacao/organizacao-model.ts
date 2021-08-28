
import { MaxLength, IsString } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

export class Organizacao extends BaseModel {

  @MaxLength(100)
  @IsString({message: 'O campo nome deve conter um texto.'})
  nome: string;
/*
  @MaxLength(100)
  @IsString({message: 'O campo login deve conter um texto.'})
  logo: string;

  @MaxLength(100)
  @IsString({message: 'O campo cnpj deve conter um texto.'})
  cnpj: string;
*/
  constructor(){
    super();
  }
}