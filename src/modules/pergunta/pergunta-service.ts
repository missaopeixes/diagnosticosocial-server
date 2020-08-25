
import db from '../../database/db-connection';
import { Pergunta, OpcaoDaPergunta } from './pergunta-model';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import * as crudUtils from '../../utils/crud-utils';
import * as opcaoRespostaService from '../opcaoResposta/opcaoResposta-service';
import { TipoResposta } from '../../commom/tipo-resposta';
import { OpcaoResposta } from '../opcaoResposta/opcaoResposta-model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

export function criar(pergunta: Pergunta) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return pergunta.validar().then(erros => {

        if (erros.length > 0) {
          return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
        }

        return db.perguntas.find({
          where: {
            descricao: pergunta.descricao
          }
        }).then((busca) => {

          if (!!busca) {
            return dbResolve(new ResultadoServico('Já existe uma pergunta com essa descrição!', StatusServico.Erro));
          }

          return db.perguntas.create(pergunta, {transaction: t})
          .then(resp => {

            if (pergunta.tipoResposta == TipoResposta.MultiplaEscolha) {

              let vinculos = pergunta.opcoesResposta.map((opcao, i) => new Object({
                idPergunta: resp.id,
                idOpcaoResposta: opcao.id,
                ordem: i
              }));
  
              return db.perguntasOpcoesResposta.bulkCreate(vinculos, {transaction: t}).then(() => {
                dbResolve(new ResultadoServico(resp));
              });
            }
            else {
              dbResolve(new ResultadoServico(resp));
            }
          });
        });
      })
      .catch(err => {
        dbReject(err);
      });

    }))
    .then((resultado) => {
      resolve(resultado);
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function listar(pagina?: number, itensPorPagina?: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.perguntas.findAll(crudUtils.montarPaginacao(pagina, itensPorPagina)).then(resp => {

      return crudUtils.montarConteudoPagina(resp, pagina, itensPorPagina);
    })
    .then((resultado) => {
      db.perguntas.count().then((count) => {
        resultado.total = count;
        return resolve(new ResultadoServico(resultado));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function pesquisar(termo: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.perguntas.findAll({
      where: {
        descricao: {
          $like: `%${termo}%`
        }
      },
      limit: 50
    }).then(resp => {

      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obter(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.perguntas.findOne({
      where: {
        id: id,
      },
      include: [{
        model: db.opcoesResposta,
        as: 'opcoesResposta',
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

export function atualizar(pergunta: Pergunta) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return db.perguntas.findOne({
        where: {
          id: pergunta.id
        }
      })
      .then(p => {

        if (!p) {
          return dbResolve(new ResultadoServico('Pergunta não encontrada', StatusServico.Erro));
        }

        return pergunta.validar().then(erros => {

          if (erros.length > 0) {
            return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
          }

          return db.perguntas.update(pergunta, {
            where: {
              id: pergunta.id
            },
            transaction: t
          }).then(resp => {

            if (pergunta.tipoResposta == TipoResposta.MultiplaEscolha) {

              return db.perguntasOpcoesResposta.destroy({
                where: {
                  idPergunta: pergunta.id,
                },
                transaction: t
              }).then(() => {

                let vinculos = pergunta.opcoesResposta.map((opcao, i) => new Object({
                  idPergunta: pergunta.id,
                  idOpcaoResposta: opcao.id,
                  ordem: i
                }));
    
                return db.perguntasOpcoesResposta.bulkCreate(vinculos, {transaction: t}).then(() => {
                  dbResolve(new ResultadoServico(resp));
                });
              });
            }
            else {
              dbResolve(new ResultadoServico(resp));
            }
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

// export function excluir(id: number) : Promise<ResultadoServico> {
//   return new Promise((resolve, reject) => {

//     db.questionarios.findOne({
//       where: {
//         id: id
//       }
//     })
//     .then(questionario => {

//       if (!questionario) {
//         return resolve(new ResultadoServico('Questionário não encontrado', StatusServico.Erro));
//       }
      
//       db.questionarios.destroy({
//         where: {
//           id: questionario.id
//         }
//       })
//       .then(resp => {
//         resolve(new ResultadoServico(resp));
//       })
//     })
//     .catch(err => {
//       reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
//     });
//   })
// };

export function vincularResposta(idPergunta: number, idOpcaoResposta: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    Promise.all([
      db.perguntas.findOne({
        where: {
          id: idPergunta
        }
      }),
      db.opcoesResposta.findOne({
        where: {
          id: idOpcaoResposta
        }
      })
    ])
    .then(([pergunta, opcaoResposta]) => {

      if (!pergunta) {
        return resolve(new ResultadoServico('Pergunta não encontrada', StatusServico.Erro));
      }
      if (!opcaoResposta) {
        return resolve(new ResultadoServico('Resposta não encontrada', StatusServico.Erro));
      }

      db.perguntasOpcoesResposta.create({
        idPergunta: pergunta.id,
        idOpcaoResposta: opcaoResposta.id
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

export function desvincularResposta(idPergunta: number, idOpcaoResposta: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    Promise.all([
      db.perguntas.findOne({
        where: {
          id: idPergunta
        }
      }),
      db.opcoesResposta.findOne({
        where: {
          id: idOpcaoResposta
        }
      })
    ])
    .then(([pergunta, opcaoResposta]) => {

      if (!pergunta) {
        return resolve(new ResultadoServico('Pergunta não encontrada', StatusServico.Erro));
      }
      if (!opcaoResposta) {
        return resolve(new ResultadoServico('Resposta não encontrada', StatusServico.Erro));
      }

      db.perguntasOpcoesResposta.destroy({
        where: {
          idOpcaoResposta: opcaoResposta.id,
          idPergunta: pergunta.id
        }
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

export function criarResposta(idPergunta: number, descricao: string) : Promise<ResultadoServico>{
  return new Promise((resolve, reject) => {

    db.perguntas.findOne({
      where: {
        id: idPergunta
      }
    })
    .then(pergunta => {

      if (!pergunta) {
        return resolve(new ResultadoServico('Pergunta não encontrada', StatusServico.Erro));
      }

      opcaoRespostaService.criar(descricao).then(resultadoNovaResposta => {

        return vincularResposta(pergunta.id, resultadoNovaResposta.conteudo.id)
        .then(() => {

          resolve(resultadoNovaResposta);
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