import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
import { HttpUtils } from '../../utils/http-utils';
import * as service from './questionario-service';
import { Pergunta } from '../pergunta/pergunta-model';
import { Questionario } from './questionario-model';

export function criar(req: Request, res: Response) {
  service.criar(new Questionario(
    req.body.nome,
    req.body.perguntas
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
  service.atualizar(parseInt(req.params.id), new Questionario(
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

  service.listar(parseInt(req.query.pagina), parseInt(req.query.itensPorPagina)).then(result => {

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

  service.listarTodos().then(result => {

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

  service.obterPerguntas(req.params.id).then(result => {

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

  service.obter(req.params.id).then(result => {

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

export function criarPergunta(req: Request, res: Response) {

  service.criarPergunta(
    req.params.id,
    new Pergunta(req.body.pergunta)
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

  service.vincularPergunta(req.params.id, req.params.idPergunta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}

export function desvincularPergunta(req: Request, res: Response) {

  service.desvincularPergunta(req.params.id, req.params.idPergunta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}