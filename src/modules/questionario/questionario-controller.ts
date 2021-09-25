import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { PaginacaoHttp } from '../../commom/paginacao-http';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './questionario-service';
import { Pergunta } from '../pergunta/pergunta-model';
import { Questionario } from './questionario-model';

export function criar(req: Request, res: Response) {
  const usuario = HttpUtils.getUserSession(req);

  service.criar(new Questionario(
    req.body.nome,
    req.body.perguntas,
    usuario.idOrganizacao
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

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");

  service.atualizar(id, new Questionario(
    req.body.nome,
    req.body.perguntas
  )).then(resultado => {

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

  let paginacao = new PaginacaoHttp(req);

  if (paginacao.temErro) {
    return res.send(HttpUtils.statusCode(paginacao.tipoErro), paginacao.erro);
  }

  const usuario = HttpUtils.getUserSession(req);

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

export function listarTodos(req: Request, res: Response) {

  const usuario = HttpUtils.getUserSession(req);

  service.listarTodos(usuario.idOrganizacao).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(200, result.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function obterPerguntas(req: Request, res: Response) {

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");

  const usuario = HttpUtils.getUserSession(req);

  service.obterPerguntas(id, usuario.idOrganizacao).then(result => {

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

  service.excluir(id).then(result => {

    if (result.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
    }

    res.send(204);
  })
  .catch(err => {
    res.send(500, err);
  });
};

export function criarPergunta(req: Request, res: Response) {

  let id = parseInt(req.params.id);

  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");

  const usuario = HttpUtils.getUserSession(req);

  service.criarPergunta(
    id,
    new Pergunta(req.body.pergunta, null, null, usuario.idOrganizacao)
  ).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}

export function vincularPergunta(req: Request, res: Response) {

  let id = parseInt(req.params.id);
  let idPergunta = parseInt(req.params.idPergunta);
  
  if (!Number.isInteger(id)) return res.send(400, "id deve ser um número.");
  if (!Number.isInteger(idPergunta)) return res.send(400, "idPergunta deve ser um número.");

  service.vincularPergunta(id, idPergunta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}

export function validarDesvinculoPergunta(req: Request, res: Response) {

  let id = parseInt(req.params.id);
  let idPergunta = parseInt(req.params.idPergunta);
  
  if (!Number.isInteger(id)) return res.send(400, "O id deve ser um número.");
  if (!Number.isInteger(idPergunta)) return res.send(400, "O idPergunta deve ser um número.");

  service.validarDesvinculoPergunta(id, idPergunta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}