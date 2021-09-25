import { Request } from 'restify';
import * as jwt from 'jsonwebtoken';
import {TipoErro, ResultadoServico, StatusServico} from '../commom/resultado-servico';
import { Usuario } from '../modules/usuario/usuario-model';

const serverConf = require('./../server.json');

export class HttpUtils {

  static statusCode(tipoErro: TipoErro) {
    switch(tipoErro) {
      case TipoErro.Validacao : return 400;
      case TipoErro.Autenticacao : return 401
      case TipoErro.Permissao : return 403
      case TipoErro.Excecao : return 500
      default : return 500;
    }
  }

  static checkUndefinedOrInteger(paramName: string, query): ResultadoServico{
    const resultado = new ResultadoServico();

    resultado.conteudo = query[paramName] != undefined ? parseInt(query[paramName]) : undefined;

    if (query[paramName] != undefined && !Number.isInteger(parseInt(query[paramName]))) {
      resultado.status = StatusServico.Erro;
      resultado.tipoErro = TipoErro.Validacao;
      resultado.conteudo = `${paramName} deve ser um número inteiro, caso esteja preenchido(a).`;
    }

    return resultado;
  }

  static getUserSession(req: Request): Usuario {
    const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
    const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

    return usuario;
  }
}