import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { PaginacaoHttp } from '../../commom/paginacao-http';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './usuario-service';
import * as jwt from 'jsonwebtoken';
import { Usuario } from './usuario-model';

const serverConf = require('../../server.json');

export function criar(req: Request, res: Response) {

  let nome = req.body.nome;
  let login = req.body.login;
  let email = req.body.email;
  let senha = req.body.senha;
  
  if (typeof nome !== "string") return res.send(400, "nome deve ser um texto.");
  if (typeof login !== "string") return res.send(400, "login deve ser um texto.");
  if (typeof email !== "string") return res.send(400, "email deve ser um texto.");
  if (typeof senha !== "string") return res.send(400, "senha deve ser um texto.");

  service.criar(nome, login, email, senha).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function editar(req: Request, res: Response) {
  
  let id = parseInt(req.params.id);
  let nome = req.body.nome;
  let login = req.body.login;
  let email = req.body.email;
  
  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número inteiro.");
  if (typeof nome !== "string") return res.send(400, "nome deve ser um texto.");
  if (typeof login !== "string") return res.send(400, "login deve ser um texto.");
  if (typeof email !== "string") return res.send(400, "email deve ser um texto.");

  service.editar(id, nome, login, email).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function listar(req: Request, res: Response) {

  let paginacao = new PaginacaoHttp(req);

  if (paginacao.temErro) {
    return res.send(HttpUtils.statusCode(paginacao.tipoErro), paginacao.erro);
  }

  service.listar(paginacao.pagina, paginacao.itensPorPagina).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function obter(req: Request, res: Response) {

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");

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

export function perfil(req: Request, res: Response) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  service.obter(usuario.id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function alterarSenha(req: Request, res: Response) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  let senhaAtual = req.body.senhaAtual;
  let senhaNova = req.body.senhaNova;

  if (typeof senhaAtual !== "string") return res.send(400, "senhaAtual deve ser um texto.");
  if (typeof senhaNova !== "string") return res.send(400, "senhaNova deve ser um texto.");

  service.alterarSenha(usuario.id, senhaAtual, senhaNova).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(204);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function excluir(req: Request, res: Response) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número inteiro.");

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