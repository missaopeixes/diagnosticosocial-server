import db from '../../database/db-connection';
import { Entrevista } from './entrevista-model';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import * as crudUtils from '../../utils/crud-utils';
import { Transaction } from 'sequelize';
import { QuestionarioRespondido } from '../questionario/questionario-model';
import { Usuario } from '../usuario/usuario-model';

interface FiltroEntrevista {
  idUsuario?: number,
  evento?: string,
  usuario?: string,
  nome?: string,
  concluidas?: boolean,
  emAndamento?: boolean
}

export function criar(entrevista: Entrevista) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return entrevista.validar().then(erros => {

        if (erros.length > 0) {
          return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
        }

        db.entrevistas.create(entrevista, {transaction: t}).then(resp => {
          dbResolve(new ResultadoServico(resp));
        });

      })
      .catch(err => dbReject(err));

    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function atualizar(idEntrevista: number, nome: string, concluida: boolean, usuarioSessao: Usuario) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {
    
    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {
      
      return db.entrevistas.findOne({
        where: {
          id: idEntrevista
        }
      })
      .then(e => {
        
        if (!e) {
          return dbResolve(new ResultadoServico('Entrevista não encontrada', StatusServico.Erro));
        }
        if (e.idUsuario !== usuarioSessao.id && !usuarioSessao.administrador) {
          return dbResolve(new ResultadoServico('Acesso negado.', StatusServico.Erro));
        }
        if (!usuarioSessao.administrador && e.concluida) {
          return dbResolve(new ResultadoServico('Não é possível editar uma entrevista já concluída.', StatusServico.Erro));
        }
        
        let novaEntrevista = new Entrevista(e.idEvento, e.idUsuario, nome, undefined, undefined, concluida);
        novaEntrevista.id = idEntrevista;
        
        return novaEntrevista.validar().then(erros => {

          if (erros.length > 0) {
            return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
          }

          db.entrevistas.update(novaEntrevista, {
            where: {
              id: e.id
            },
            transaction: t
          }).then(resp => {

            dbResolve(new ResultadoServico(resp));
          });
        })
        .catch(err => dbReject(err));

      })
      .catch(err => dbReject(err));
    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function salvarQuestionarioRespondido(questionario: QuestionarioRespondido) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return questionario.validar().then(erros => {

        if (erros.length > 0) {
          return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
        }

        return db.questionariosRespondidos.create(questionario, {transaction: t}).then(resp => {

          questionario.respostas.forEach((r) => {
            r.idQuestionarioRespondido = resp.id;
          });

          return db.respostas.bulkCreate(questionario.respostas, {transaction: t}).then(() => {
            dbResolve(new ResultadoServico(resp));
          })
        });

      })
      .catch(err => dbReject(err));

    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function atualizarQuestionarioRespondido(questionario: QuestionarioRespondido, usuarioSessao: Usuario) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return db.questionariosRespondidos.findOne({
        where: {
          id: questionario.id
        }
      })
      .then(q => {

        if (!q) {
          return dbResolve(new ResultadoServico('Questionário respondido não encontrado', StatusServico.Erro));
        }

        return questionario.validar().then(erros => {

          if (erros.length > 0) {
            return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
          }

          return db.entrevistas.findOne({
            where: {
              id: q.idEntrevista
            }
          }).then(e => {
            
            if (!e) {
              return dbResolve(new ResultadoServico('Entrevista não encontrada', StatusServico.Erro));
            }
            if (e.idUsuario !== usuarioSessao.id && !usuarioSessao.administrador) {
              return dbResolve(new ResultadoServico('Acesso negado.', StatusServico.Erro));
            }
            if (!usuarioSessao.administrador && e.concluida) {
              return dbResolve(new ResultadoServico('Não é possível editar uma entrevista já concluída.', StatusServico.Erro));
            }
            
            db.questionariosRespondidos.update(questionario,{
              where: {
                id: q.id
              }, transaction: t}).then(resp => {

              return db.respostas.destroy({
                where: {
                  idQuestionarioRespondido: q.id,
                },
                transaction: t
              }).then(() => {
  
                questionario.respostas.forEach((r) => {r.idQuestionarioRespondido = q.id;});
  
                db.respostas.bulkCreate(questionario.respostas, {transaction: t}).then(() => {
                  dbResolve(new ResultadoServico(resp));
                });
              });
            });
          })
          .catch(err => dbReject(err));

        });
      })
      .catch(err => dbReject(err));

    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};



export function listar(pagina: number = 1, itensPorPagina: number = 15, filtro: FiltroEntrevista, idOrganizacao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    const qtd = itensPorPagina || 15;

    let filtroQuery = `WHERE ev.idOrganizacao = ${idOrganizacao}`;
    if (filtro.concluidas && filtro.emAndamento) {
      //Sem filtro para conclusão de entrevistas
    }
    if (filtro.concluidas && !filtro.emAndamento) {
      filtroQuery = filtroQuery.concat(` AND e.concluida = true `);
    }
    if (!filtro.concluidas && filtro.emAndamento) {
      filtroQuery = filtroQuery.concat(` AND e.concluida = false `);
    }

    if (!!filtro.idUsuario) {
      filtroQuery.concat(`AND u.id = ${filtro.idUsuario} `)
    }
    if (!!filtro.evento) {
      filtroQuery.concat(`AND ev.nome LIKE '%${filtro.evento}%' `)
    }
    if (!!filtro.usuario) {
      filtroQuery.concat(`AND u.nome LIKE '%${filtro.usuario}%' `)
    }
    if (!!filtro.nome) {
      filtroQuery.concat(`AND e.nome LIKE '%${filtro.nome}%' `)
    }

    const queryBody = `FROM entrevistas e
      LEFT JOIN eventos ev ON ev.id = e.idEvento
      LEFT JOIN usuarios u ON u.id = e.idUsuario
      ${filtroQuery}
      ORDER BY e.concluida, e.createdAt DESC`;
    const queryRaw = `SELECT e.*, ev.nome AS evento, u.nome AS usuario ${queryBody} LIMIT ${(pagina - 1) * qtd}, ${qtd};`;
    const queryCount = `SELECT COUNT(e.id) as total ${queryBody}`;

    db.sequelize.query(queryRaw, { model: db.entrevistas })
    .then(data => crudUtils.montarConteudoPagina(data, pagina, itensPorPagina))
    .then(resultado => {
      return db.sequelize.query(queryCount, {raw: true}).then((resp) => {
        resultado.total = resp[0][0]['total'];
        return resolve(new ResultadoServico(resultado));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obterRespostasQuestionario(idQuestionarioRespondido: number, idEntrevista: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.respostas.findAll({
      where: {
        idQuestionarioRespondido: idQuestionarioRespondido,
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

export function obter(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.entrevistas.findOne({
      where: {
        id: id
      },
      include: [{
        model: db.questionariosRespondidos,
        as: 'questionariosRespondidos'
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

export function excluirQuestionarioRespondido(id: number, idEntrevista: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      db.questionariosRespondidos.findOne({
        where: {
          id: id
        }
      })
      .then(obj => {

        if (!obj) {
          return dbResolve(new ResultadoServico('Questionário respondido não encontrado', StatusServico.Erro));
        }
        if (obj.idEntrevista !== idEntrevista) {
          return dbResolve(new ResultadoServico('Questionário respondido não pertence à entrevista.', StatusServico.Erro));
        }

        return db.respostas.destroy({
          where: {
            idQuestionarioRespondido: obj.id,
          },
          transaction: t
        }).then(() => {

          return db.questionariosRespondidos.destroy({
            where: {
              id: obj.id
            },
            transaction: t
          })
          .then(resp => {
            dbResolve(new ResultadoServico(resp));
          });
        });
      })
      .catch(err => dbReject(err));

    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  })
};

export function excluir(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {


    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      db.entrevistas.findOne({
        where: {
          id: id
        }
      })
      .then(entrevista => {

        if (!entrevista) {
          return dbResolve(new ResultadoServico('Entrevista não encontrada.', StatusServico.Erro));
        }

        return db.entrevistas.destroy({where: {id: id}, transaction: t})
        .then(resp => {
          dbResolve(new ResultadoServico(resp));
        });

      })
      .catch(err => dbReject(err));

    }))
    .then((resultado) => resolve(resultado))
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  })
};