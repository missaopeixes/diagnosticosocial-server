import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import * as service from '../importacao/importacao-service';

// @TODO: alterar para receber json pelo post ao invés de pegar pelo arquivo.
export function importar(req: Request, res: Response) {
  const usuario = HttpUtils.getUserSession(req);

  service.importar(usuario.idOrganizacao).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};