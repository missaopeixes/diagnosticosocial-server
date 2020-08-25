import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './entrevista-service';
import { Entrevista } from './entrevista-model';
import * as jwt from 'jsonwebtoken';
import { Usuario } from '../usuario/usuario-model';
import { QuestionarioRespondido } from '../questionario/questionario-model';

const serverConf = require('../../server.json');

export function criar(req: Request, res: Response) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  service.criar(new Entrevista(
    req.body.idEvento,
    usuario.id,
    req.body.nome,
    req.body.respostas,
    req.body.observacoes,
  )).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};


export function atualizar(req: Request, res: Response) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  let obj = new Entrevista(
    req.body.idEvento,
    usuario.id,
    req.body.nome,
    req.body.respostas,
    req.body.observacoes,
    req.body.concluida
  );
  obj.id = parseInt(req.params.id);

  service.atualizar(obj).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(204);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function salvarQuestionarioRespondido(req: Request, res: Response) {

  service.salvarQuestionarioRespondido(new QuestionarioRespondido(
    req.params.idEntrevista,
    req.body.idQuestionario,
    req.body.respostas,
    req.body.observacoes,
  )).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function atualizarQuestionarioRespondido(req: Request, res: Response) {

  service.atualizarQuestionarioRespondido(new QuestionarioRespondido(
    req.params.idEntrevista,
    req.body.idQuestionario,
    req.body.respostas,
    req.body.observacoes,
    parseInt(req.params.id),
  )).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function excluirQuestionarioRespondido(req: Request, res: Response) {

  service.excluirQuestionarioRespondido(parseInt(req.params.id), parseInt(req.params.idEntrevista)).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(204);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function obterRespostasQuestionario(req: Request, res: Response) {

  service.obterRespostasQuestionario(req.params.id, req.params.idEntrevista).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function listar(req: Request, res: Response) {

  service.listar(
    parseInt(req.query.pagina),
    parseInt(req.query.itensPorPagina),
    req.query.filtroEvento,
    req.query.filtroUsuario,
    req.query.filtroNome,
    req.query.filtroConcluidas === 'true',
  ).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function obter(req: Request, res: Response) {

  service.obter(req.params.id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function excluir(req: Request, res: Response) {

  service.excluir(req.params.id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(204);
  })
  .catch(err => {
    res.send(500, err);
  });
};