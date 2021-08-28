
import { MaxLength, validate, IsEmail, IsBoolean, IsString } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

export class Usuario extends BaseModel {

  @MaxLength(100)
  @IsString({message: 'O campo nome deve conter um texto.'})
  nome: string;

  @MaxLength(100)
  @IsString({message: 'O campo login deve conter um texto.'})
  login: string;

  @MaxLength(100)
  @IsEmail({},{message: 'O campo e-mail deve conter um endereço válido.'})
  email: string;

  @MaxLength(50)
  @IsString({message: 'O campo senha deve conter um texto.'})
  senha: string;

  @IsBoolean({message: 'O campo administrador deve conter um boleano.'})
  administrador: boolean;
  
  idOrganizacao: number;

  constructor(){
    super();

    this.senha = 'password';
  }
}