
import {TipoErro} from '../commom/resultado-servico';

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
}