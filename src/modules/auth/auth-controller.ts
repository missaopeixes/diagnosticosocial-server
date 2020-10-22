import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import { Usuario } from '../usuario/usuario-model';
import * as service from './auth-service';

export function signin(req: Request, res: Response) {

  if (!req.body || !req.body.login || typeof req.body.login != "string") return res.send(400, "login deve ser um texto.");
  if (!req.body || !req.body.senha || typeof req.body.senha != "string") return res.send(400, "senha deve ser um texto.");

  let login = req.body.login;
  let senha = req.body.senha;

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

export function solicitarNovaSenha(req: Request, res: Response) {
  
  if (!req.body || !req.body.email || typeof req.body.email != "string") return res.send(400, "email deve ser um texto.");

  let email = req.body.email;

  service.solicitarNovaSenha(email).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function validarSolicitacao(req: Request, res: Response) {

  if (!req.query || !req.query.token || typeof req.query.token != "string") return res.send(400, "token deve ser um texto.");

  let token = req.query.token;

  service.validarSolicitacao(token).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function alterarSenha(req: Request, res: Response) {

  if (!req.body || !req.body.senha || typeof req.body.senha != "string") return res.send(400, "senha deve ser um texto.");
  if (!req.body || !req.body.confirmaSenha || typeof req.body.confirmaSenha != "string") return res.send(400, "confirmaSenha deve ser um texto.");
  if (!req.body.usuario) return res.send(400, "usuario não informado.");

  let senha = req.body.senha;
  let confirmaSenha = req.body.confirmaSenha;
  let usuario = new Usuario();

  usuario.id = req.body.usuario.id;
  usuario.nome = req.body.usuario.nome;
  usuario.login = req.body.usuario.login;
  usuario.email = req.body.usuario.email;
  usuario.senha = req.body.usuario.senha;

  if (senha === confirmaSenha) {
    service.alterarSenha(senha, usuario).then(resultado => {
  
      if (resultado.status === StatusServico.Erro) {
        return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
      }
  
      res.send(resultado.conteudo);
    })
    .catch(err => {
      res.send(500, err);
    });
  }else{
    return res.send(400, "Confirme corretamente sua nova senha!");
  }
};