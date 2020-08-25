import { Request, Response } from 'restify';
import { StatusServico } from '../../commom/resultado-servico';
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
  let obj = new Pergunta(req.body.descricao, req.body.tipoResposta, req.body.opcoesResposta);
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

export function pesquisar(req: Request, res: Response) {

  service.pesquisar(req.query.termo).then(result => {

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

// export function excluir(req: Request, res: Response) {

//   service.excluir(req.params.id).then(result => {

//     if (result.status === StatusServico.Erro) {
//       return res.send(HttpUtils.statusCode(result.tipoErro), result.conteudo)
//     }

//     res.send(204);
//   })
//   .catch(err => {
//     res.send(500, err);
//   });
// };

export function criarResposta(req: Request, res: Response) {

  service.criarResposta(req.params.id, req.body.descricao).then(resultado => {

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

  service.vincularResposta(req.params.id, req.params.idOpcaoResposta).then(resultado => {

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

  service.desvincularResposta(req.params.id, req.params.idOpcaoResposta).then(resultado => {

    if (resultado.status === StatusServico.Erro) {
      return res.send(HttpUtils.statusCode(resultado.tipoErro), resultado.conteudo);
    }

    res.send(200, resultado.conteudo);
  })
  .catch(err => {
    res.send(500, err);
  });
}