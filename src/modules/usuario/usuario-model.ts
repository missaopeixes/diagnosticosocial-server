
import { MaxLength, validate, IsEmail } from 'class-validator';
import { BaseModel } from '../../commom/base-model';

export class Usuario extends BaseModel {

  @MaxLength(100)
  nome: string;

  @MaxLength(100)
  login: string;

  @MaxLength(100)
  @IsEmail({},{message: 'O campo e-mail deve conter um endereço válido.'})
  email: string;

  @MaxLength(50)
  senha: string;

  constructor(){
    super();

    this.senha = 'password';
  }
}