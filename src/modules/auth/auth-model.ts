
export class Auth {

  id: number = 0;
  login: string = '';
  nome: string = '';
  administrador: boolean = false;
  idOrganizacao: number = 0;
  validade: string = '1d';
  token: string = '';

  constructor(obj?: Partial<Auth>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}