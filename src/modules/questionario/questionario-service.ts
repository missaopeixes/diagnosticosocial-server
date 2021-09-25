
import db from '../../database/db-connection';
import contextoPerguntas from '../../database/context/perguntas';
import { Questionario } from './questionario-model';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import { Op, Transaction } from 'sequelize';
import * as crudUtils from '../../utils/crud-utils';
import * as perguntaService from '../pergunta/pergunta-service';
import { TipoResposta } from '../../commom/tipo-resposta';
import { OpcaoDaPergunta, Pergunta } from '../pergunta/pergunta-model';
import { Sequelize } from 'sequelize-typescript';
import _ = require('lodash');
import { OpcaoResposta } from '../opcaoResposta/opcaoResposta-model';

const ITENS_POR_PAGINA = 15;

function _verificaNomeExistente(nome: string, idOrganizacao: number, id?: number) : Promise<boolean> {
  let where = {
    nome: nome,
    idOrganizacao: idOrganizacao
  };

  if (!!id) {
    where['id'] = {
      [Op.ne]: id
    };
  }

  return new Promise(resolve => {
    db.questionarios.findOne({
      where: where
    })
    .then(questionario => {

      resolve(!!questionario);
    });
  });
};


export function criar(questionario: Questionario) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return questionario.validar().then(erros => {

        if (erros.length > 0) {
          return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
        }

        return _verificaNomeExistente(questionario.nome, questionario.idOrganizacao).then(nomeExistente => {

          if (nomeExistente) {
            return dbResolve(new ResultadoServico('Já existe um questionário com este nome.', StatusServico.Erro));
          }

          return db.questionarios.create(questionario, {transaction: t}).then(resp => {

            let vinculos = questionario.perguntas.map((p, i) => new Object({
              idQuestionario: resp.id,
              idPergunta: p.id,
              ordem: i
            }));

            return db.questionarioPerguntas.bulkCreate(vinculos, {transaction: t}).then(() => {

              dbResolve(new ResultadoServico(resp));
            });
          });
        });

      })
      .catch(err => {
        dbReject(err);
      });

    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function listar(pagina: number = 1, itensPorPagina: number = 15, idOrganizacao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.questionarios.findAll(crudUtils.montarPaginacaoPorOrg(pagina, itensPorPagina, idOrganizacao)).then(resp => {

      return crudUtils.montarConteudoPagina(resp, pagina, itensPorPagina);
    })
    .then((resultado) => {
      db.questionarios.count({where: {idOrganizacao: idOrganizacao}}).then((count) => {
        resultado.total = count;
        return resolve(new ResultadoServico(resultado));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function listarTodos(idOrganizacao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.questionarios.findAll({where: {idOrganizacao: idOrganizacao}}).then((resultado) => resolve(new ResultadoServico(resultado)))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obter(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.questionarios.findOne({
      where: {
        id: id,
      },
      include: [{
        model: db.perguntas,
        as: 'perguntas',
        through: {
          attributes: ['id', 'descricao'],
        }
      }]
    })
    .then(resp => {
      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obterPerguntas(id: number, idOrganizacao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.query(
      `SELECT p.descricao AS pergunta, op.descricao AS opcaoResposta, p.id AS idPergunta, op.id AS idOpcaoResposta, p.tipoResposta
      FROM questionarios q
      LEFT JOIN questionarioPerguntas qp ON q.id = qp.idQuestionario
      LEFT JOIN perguntas p ON p.id = qp.idPergunta
      LEFT JOIN perguntasOpcoesResposta pop ON pop.idPergunta = p.id
      LEFT JOIN opcoesResposta op ON op.id = pop.idOpcaoResposta
      WHERE q.id = ${id} AND q.idOrganizacao = ${idOrganizacao}
      ORDER BY qp.ordem, pop.ordem
      ;`, {raw: true, type: Sequelize.QueryTypes.SELECT})
    .then(resp => {
      let group = _.groupBy(resp, 'idPergunta');
      let list = _.toArray(group);

      let perguntas: Pergunta[] =
        list.map(p => {
          let pergunta = new Pergunta(p[0].pergunta, parseInt(p[0].tipoResposta), null, p[0].idOrganizacao);
          pergunta.id = p[0].idPergunta;

          pergunta.opcoesResposta = p.map((item) => {
            let op = new OpcaoResposta(item.opcaoResposta, item.idOrganizacao);
            op.id = item.idOpcaoResposta;
            return op;
          });

          return pergunta;
        });
      resolve(new ResultadoServico(perguntas));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
}

export function atualizar(id: number, questionario: Questionario) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return db.questionarios.findOne({
        where: {
          id: id
        }
      })
      .then(resp => {

        if (!resp) {
          return dbResolve(new ResultadoServico('Questionário não encontrado', StatusServico.Erro));
        }

        return _verificaNomeExistente(questionario.nome, questionario.idOrganizacao, id).then(nomeExistente => {

          if (nomeExistente) {
            return dbResolve(new ResultadoServico('Já existe um questionário com este nome.', StatusServico.Erro));
          }

          return questionario.validar().then(erros => {

            if (erros.length > 0) {
              return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
            }

            return db.questionarios.update({nome: questionario.nome}, {
              where: {
                id: id
              },
              transaction: t
            }).then(resp => {


              return db.questionarioPerguntas.destroy({
                where: {
                  idQuestionario: id,
                },
                transaction: t
              }).then(() => {

                let vinculos = questionario.perguntas.map((pergunta, i) => new Object({
                  idQuestionario: id,
                  idPergunta: pergunta.id,
                  ordem: i
                }));
    
                return db.questionarioPerguntas.bulkCreate(vinculos, {transaction: t}).then(() => {
                  dbResolve(new ResultadoServico(resp));
                });
              });
            });
          });
        });
      })
      .catch(err => {
        dbReject(err);
      });

    })
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    }));

  });
};

export function excluir(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      db.questionarios.findOne({
        where: {
          id: id
        }
      })
      .then(questionario => {

        if (!questionario) {
          return dbResolve(new ResultadoServico('Questionário não encontrado', StatusServico.Erro));
        }

        return db.eventosQuestionarios.findAll({
          where: {
            idQuestionario: questionario.id
          },
          transaction: t
        })
        .then(resultado => {
          
          if (resultado.length > 0) {
            return dbResolve(new ResultadoServico('Este questionário está vinculado á um evento. Remova-o do evento antes de excluí-lo.', StatusServico.Erro));
          }

          return db.questionarioPerguntas.destroy({
            where: {
              idQuestionario: questionario.id
            },
            transaction: t
          })
          .then(() => {
            return db.questionarios.destroy({
              where: {
                id: questionario.id
              },
              transaction: t
            })
            .then(resp => {
              dbResolve(new ResultadoServico(resp));
            });
          });
        });
      })
      .catch(err => {
        dbReject(err);
      });

    })
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    }));

  });
};

export function vincularPergunta(idQuestionario: number, idPergunta: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    Promise.all([
      db.questionarios.findOne({
        where: {
          id: idQuestionario
        }
      }),
      db.perguntas.findOne({
        where: {
          id: idPergunta
        }
      })
    ])
    .then(([questionario, pergunta]) => {

      if (!questionario) {
        return resolve(new ResultadoServico('Questionário não encontrado', StatusServico.Erro));
      }
      if (!pergunta) {
        return resolve(new ResultadoServico('Pergunta não encontrada', StatusServico.Erro));
      }

      db.questionarioPerguntas.create({
        idPergunta: pergunta.id,
        idQuestionario: questionario.id
      })
      .then((resp) => {
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
};

export function validarDesvinculoPergunta(idQuestionario: number, idPergunta: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    Promise.all([
      db.questionarios.findOne({
        where: {
          id: idQuestionario
        }
      }),
      db.perguntas.findOne({
        where: {
          id: idPergunta
        }
      })
    ])
    .then(([questionario, pergunta]) => {

      if (!questionario) {
        return resolve(new ResultadoServico('Questionário não encontrado', StatusServico.Erro));
      }
      if (!pergunta) {
        return resolve(new ResultadoServico('Pergunta não encontrada', StatusServico.Erro));
      }

      db.respostas.findAll({
        where: {
          idPergunta: pergunta.id
        }
      }).then(resultado => {

        if (resultado.length > 0) {
          return resolve(new ResultadoServico('Esta pergunta já foi respondida neste ou em outro questionário. Não é mais possível removê-la.', StatusServico.Erro));
        }
        
        resolve(new ResultadoServico(true));
      })
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function criarPergunta(idQuestionario: number, pergunta: Pergunta) : Promise<ResultadoServico>{
  return new Promise((resolve, reject) => {

    db.questionarios.findOne({
      where: {
        id: idQuestionario
      }
    })
    .then(questionario => {

      if (!questionario) {
        return resolve(new ResultadoServico('Questionário não encontrado', StatusServico.Erro));
      }

      perguntaService.criar(pergunta).then(resultadoNovaPergunta => {

        return vincularPergunta(questionario.id, parseInt(resultadoNovaPergunta.conteudo.id))
        .then(() => {
          resolve(resultadoNovaPergunta);
        });
      })
      .catch(err => {
        reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
}