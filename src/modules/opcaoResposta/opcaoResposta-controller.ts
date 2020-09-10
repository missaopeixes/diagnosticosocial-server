import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './opcaoResposta-service';

export function pesquisar(req: Request, res: Response) {

  let termo = req.query.termo;

  if (typeof termo !== "string") return res.send(400, "Termo deve ser um texto.");

  service.pesquisar(termo).then(result => {

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

  let descricao = req.body.descricao;

  if (typeof descricao !== "string") return res.send(400, "Termo deve ser um texto.");

  service.criar(descricao).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};