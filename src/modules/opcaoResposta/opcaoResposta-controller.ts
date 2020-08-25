import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './opcaoResposta-service';

export function pesquisar(req: Request, res: Response) {

  service.pesquisar(req.query.termo).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function criar(req: Request, res: Response) {

  service.criar(req.body.descricao).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};