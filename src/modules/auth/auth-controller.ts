import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './auth-service';

export function signin(req: Request, res: Response) {

  let login = req.body.login;
  let senha = req.body.senha;

  if (typeof login !== "string") return res.send(400, "login deve ser um texto.");
  if (typeof senha !== "string") return res.send(400, "senha deve ser um texto.");

  service.signin(login, senha).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};