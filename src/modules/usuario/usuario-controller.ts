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
  let administrador = req.body.administrador;
  let idOrganizacao = req.body.idOrganizacao;
  
  service.criar(nome, login, email, senha, administrador, idOrganizacao).then(resultado => {

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
  let administrador = req.body.administrador;
  
  if (!Number.isInteger(id)) return res.send(400, "O id deve ser um número inteiro.");

  service.editar(id, nome, login, email, administrador).then(resultado => {

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

  const usuario = HttpUtils.getUserSession(req);

  if (paginacao.temErro) {
    return res.send(HttpUtils.statusCode(paginacao.tipoErro), paginacao.erro);
  }

  service.listar(paginacao.pagina, paginacao.itensPorPagina, usuario.idOrganizacao).then(result => {

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

export function perfil(req: Request, res: Response) {
  const usuario = HttpUtils.getUserSession(req);

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
  const usuario = HttpUtils.getUserSession(req);

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
  const usuario = HttpUtils.getUserSession(req);

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