import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { PaginacaoHttp } from '../../commom/paginacao-http';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './organizacao-service';
import * as jwt from 'jsonwebtoken';
import { Organizacao } from './organizacao-model';

const serverConf = require('../../server.json');

export function editar(req: Request, res: Response) {
  
  let id = parseInt(req.params.id);
  let nome = req.body.nome;
  
  if (!Number.isInteger(id)) return res.send(400, "O id deve ser um número inteiro.");

  service.editar(id, nome).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function obter(req: Request, res: Response) {

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "O id deve ser um número.");

  service.obter(id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function excluir(req: Request, res: Response) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Organizacao;

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "O id deve ser um número inteiro.");

  service.excluir(id, usuario.id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(204);
  })
  .catch(err => {
    res.send(500, err);
  });
};