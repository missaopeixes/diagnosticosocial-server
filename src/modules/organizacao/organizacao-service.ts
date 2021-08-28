import db from '../../database/db-connection';
import { Organizacao } from './organizacao-model';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';

export function editar(idOrganizacao: number, nome: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {
    
    const organizacao = new Organizacao();
    organizacao.id = idOrganizacao;
    organizacao.nome = nome;

    organizacao.validar().then(erros => {

      if (erros.length > 0) {
        return resolve(new ResultadoServico(erros, StatusServico.Erro));
      }

      db.organizacoes.findOne({where: {id: organizacao.id}}).then((obj) => {
        if (!obj) return resolve(new ResultadoServico('Organização inexistente!', StatusServico.Erro));

        db.organizacoes.update({
          nome: organizacao.nome,
        }, {where: {id: idOrganizacao}}).then(resp => resolve(new ResultadoServico(resp)));
      })
      .catch(err => reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao)));

    });
  });
};

export function obter(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.organizacoes.findOne({
      where: {
        id: id
      }
    })
    .then(resp => {
      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function excluir(id: number, idOrganizacaoSessao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    if (id !== idOrganizacaoSessao)
      return resolve(new ResultadoServico('Não é possível excluir outra organização.', StatusServico.Erro));

    db.organizacoes.findOne({where: {id: id}}).then(organizacao => {
      if (!organizacao) return resolve(new ResultadoServico('Organização não encontrada', StatusServico.Erro));

      db.organizacoes.destroy({where: {id: organizacao.id}})
        .then(resp => resolve(new ResultadoServico(resp)))
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  })
};