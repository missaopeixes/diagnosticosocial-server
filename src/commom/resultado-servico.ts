
export enum StatusServico {
  Sucesso = 1,
  Erro
};

export enum TipoErro {
  Validacao = 1,
  Autenticacao,
  Permissao,
  Excecao
};

export class ResultadoServico {

  constructor(public conteudo?: any, public status: StatusServico = StatusServico.Sucesso, public tipoErro? : TipoErro) {

    if (status === StatusServico.Erro && !this.tipoErro) {
      this.tipoErro = TipoErro.Validacao;
    }
  };
};