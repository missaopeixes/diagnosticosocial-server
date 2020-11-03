import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { PaginacaoHttp } from '../../commom/paginacao-http';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './pergunta-service';
import { Pergunta } from './pergunta-model';

export function criar(req: Request, res: Response) {
  service.criar(new Pergunta(
    req.body.descricao,
    req.body.tipoResposta,
    req.body.opcoesResposta
    )).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function atualizar(req: Request, res: Response) {

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");

  let obj = new Pergunta(req.body.descricao, req.body.tipoResposta, req.body.opcoesResposta);
  obj.id = id;

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

export function listar(req: Request, res: Response) {

  req.query.filtroUtilizadas = req.query.filtroUtilizadas === "true";

  if (req.query.filtroDescricao === undefined){
    req.query.filtroDescricao = '';
  }

  let paginacao = new PaginacaoHttp(req);

  if (paginacao.temErro) {
    return res.send(HttpUtils.statusCode(paginacao.tipoErro), paginacao.erro);
  }

  service.listar(
    paginacao.pagina,
    paginacao.itensPorPagina,
    req.query.filtroDescricao,
    req.query.filtroUtilizadas
    ).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function pesquisar(req: Request, res: Response) {

  let termo = req.query.termo;

  if (typeof termo !== "string") return res.send(400, "termo deve ser um texto.");

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

export function excluir(req: Request, res: Response) {

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");

  service.excluir(req.params.id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function criarResposta(req: Request, res: Response) {

  let id = parseInt(req.params.id);
  let descricao = req.body.descricao;

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");
  if (typeof descricao !== "string") return res.send(400, "descricao deve ser um texto.");

  service.criarResposta(id, descricao).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}

export function vincularResposta(req: Request, res: Response) {

  let id = parseInt(req.params.id);
  let idOpcaoResposta = parseInt(req.params.idOpcaoResposta);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");
  if (!Number.isInteger(idOpcaoResposta)) return res.send(400, "idOpcaoResposta deve ser um número.");

  service.vincularResposta(id, idOpcaoResposta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}

export function desvincularResposta(req: Request, res: Response) {

  let id = parseInt(req.params.id);
  let idOpcaoResposta = parseInt(req.params.idOpcaoResposta);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");
  if (!Number.isInteger(idOpcaoResposta)) return res.send(400, "idOpcaoResposta deve ser um número.");

  service.desvincularResposta(id, idOpcaoResposta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}