import { ResultadoServico, StatusServico, TipoErro } from "../../commom/resultado-servico";
import { OpcaoResposta } from "./opcaoResposta-model";
import db from '../../database/db-connection';

export function criar(descricao: string, idOrganizacao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    const opcaoResposta = new OpcaoResposta(descricao, idOrganizacao);

    opcaoResposta.validar().then(erros => {

      if (erros.length > 0) {
        return resolve(new ResultadoServico(erros, StatusServico.Erro));
      }

      db.opcoesResposta.find({
        where: {
          idOrganizacao: idOrganizacao,
          descricao: descricao
        }
      }).then((busca) => {

        if (!!busca) {
          return resolve(new ResultadoServico('Já existe uma opção de resposta com essa descrição!', StatusServico.Erro));
        }

        db.opcoesResposta.create(opcaoResposta)
        .then(resp => {
          resolve(new ResultadoServico(resp));
        })
        .catch(err => {
          reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
        });
      })
      .catch(err => {
        reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
      });
    });
  });
};

export function pesquisar(termo: string, idOrganizacao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.opcoesResposta.findAll({
      where: {
        idOrganizacao: idOrganizacao,
        descricao: {
          $like: `%${termo}%`
        }
      },
      limit: 50
    })
    .then(resp => resolve(new ResultadoServico(resp)))
    .catch(err =>
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao))
    );
  });
};