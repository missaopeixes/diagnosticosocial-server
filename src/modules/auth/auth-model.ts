import { Organizacao } from "../organizacao/organizacao-model";

export class Auth {

  id: number = 0;
  login: string = '';
  nome: string = '';
  administrador: boolean = false;
  organizacao: any = null;
  validade: string = '1d';
  token: string = '';

  constructor(obj?: Partial<Auth>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}