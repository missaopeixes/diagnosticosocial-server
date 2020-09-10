import { Request } from 'restify';
import { HttpUtils } from '../utils/http-utils';
import { StatusServico, TipoErro, ResultadoServico } from './resultado-servico';

export class PaginacaoHttp {

  public paginaValidacao: ResultadoServico;
  public itensPorPaginaValidacao: ResultadoServico; 
  public pagina: number;
  public itensPorPagina: number; 

  public temErro: boolean = false;
  public erro: string;
  public tipoErro: TipoErro;

  constructor(public req?: Request) {

    this.paginaValidacao = HttpUtils.checkUndefinedOrInteger('pagina', req.query);
    this.itensPorPaginaValidacao = HttpUtils.checkUndefinedOrInteger('itensPorPagina', req.query);
  
    if (this.paginaValidacao.status === StatusServico.Erro) {

      this.temErro = true;
      this.erro = this.paginaValidacao.conteudo;
      this.tipoErro = this.paginaValidacao.tipoErro;
      return;
    }

    if (this.itensPorPaginaValidacao.status === StatusServico.Erro) {

      this.temErro = true;
      this.erro = this.itensPorPaginaValidacao.conteudo;
      this.tipoErro = this.itensPorPaginaValidacao.tipoErro;
      return;
    }

    this.pagina = this.paginaValidacao.conteudo;
    this.itensPorPagina = this.itensPorPaginaValidacao.conteudo;
  }

};