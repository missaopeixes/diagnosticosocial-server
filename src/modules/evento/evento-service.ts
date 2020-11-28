
import db from '../../database/db-connection';
import { Cruzamento, Evento, QtdQuestionarioPorEnquete } from './evento-model';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import { Op, Transaction } from 'sequelize';
import * as crudUtils from '../../utils/crud-utils';
import { Entrevista } from '../entrevista/entrevista-model';
import { TipoResposta } from '../../commom/tipo-resposta';
import { Resposta } from '../resposta/resposta-model';
import _ = require('lodash');
import { QuestionarioRespondido } from '../questionario/questionario-model';
import { Sequelize } from 'sequelize-typescript';

const ITENS_POR_PAGINA = 15;

function _verificaNomeExistente(nome: string, id?: number) : Promise<boolean> {
  let where = {
    nome: nome
  };

  if (!!id) {
    where['id'] = {
      [Op.ne]: id
    };
  }

  return new Promise(resolve => {
    db.eventos.findOne({
      where: where
    })
    .then(evento => {

      resolve(!!evento);
    });
  });
};


export function criar(evento: Evento) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return evento.validar().then(erros => {

        if (erros.length > 0) {
          return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
        }

        return _verificaNomeExistente(evento.nome).then(nomeExistente => {

          if (nomeExistente) {
            return dbResolve(new ResultadoServico('Já existe um evento com este nome.', StatusServico.Erro));
          }

          return db.eventos.create(evento, {transaction: t}).then(resp => {

            let vinculos = evento.questionarios.map((p, i) => new Object({
              idEvento: resp.id,
              idQuestionario: p.idQuestionario,
              quantidadePorEnquete: p.quantidadePorEnquete,
              ordem: i
            }));

            return db.eventosQuestionarios.bulkCreate(vinculos, {transaction: t}).then(() => {
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

export function listar(pagina: number = 1, itensPorPagina: number = 15) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.eventos.findAll(crudUtils.montarPaginacao(pagina, itensPorPagina)).then(resp => {

      return crudUtils.montarConteudoPagina(resp, pagina, itensPorPagina);
    })
    .then((resultado) => {
      db.eventos.count().then((count) => {
        resultado.total = count;
        return resolve(new ResultadoServico(resultado));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obter(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.eventos.findOne({
      where: {
        id: id,
      },
      include: [{
        model: db.eventosQuestionarios,
        as: 'questionarios'
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

export function obterTodos() : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.eventos.findAll()
    .then(resp => {
      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obterQuestionarios(idEvento: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.query(
      `SELECT q.*, eq.quantidadePorEnquete, eq.ordem FROM questionarios AS q
      LEFT JOIN eventosQuestionarios AS eq ON eq.idQuestionario = q.id WHERE eq.idEvento = ${idEvento} ORDER BY eq.ordem;`, { model: db.questionarios })
    .then(resp => {
      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function atualizar(id: number, evento: Evento) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return db.eventos.findOne({
        where: {
          id: id
        }
      })
      .then(resp => {

        if (!resp) {
          return dbResolve(new ResultadoServico('Evento não encontrado', StatusServico.Erro));
        }

        return _verificaNomeExistente(evento.nome, id).then(nomeExistente => {

          if (nomeExistente) {
            return dbResolve(new ResultadoServico('Já existe um evento com este nome.', StatusServico.Erro));
          }

          return evento.validar().then(erros => {

            if (erros.length > 0) {
              return dbResolve(new ResultadoServico(erros, StatusServico.Erro));
            }

            return db.eventos.update({nome: evento.nome}, {
              where: {
                id: id
              },
              transaction: t
            }).then(resp => {


              return db.eventosQuestionarios.destroy({
                where: {
                  idEvento: id,
                },
                transaction: t
              }).then(() => {

                let vinculos = evento.questionarios.map((q, i) => new Object({
                  idEvento: id,
                  idQuestionario: q.idQuestionario,
                  quantidadePorEnquete: q.quantidadePorEnquete,
                  ordem: i
                }));
    
                return db.eventosQuestionarios.bulkCreate(vinculos, {transaction: t}).then(() => {
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

      db.eventos.findOne({
        where: {
          id: id
        }
      })
      .then(evento => {

        if (!evento) {
          return dbResolve(new ResultadoServico('Evento não encontrado', StatusServico.Erro));
        }

        db.eventosQuestionarios.destroy({
          where: {
            idEvento: evento.id
          },
          transaction: t
        })
        .then(() => {
          db.eventos.destroy({
            where: {
              id: evento.id
            },
            transaction: t
          })
          .then(resp => {
            dbResolve(new ResultadoServico(resp));
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

export function preencherMock(idEvento: number, idUsuario: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

      return db.eventos.findOne({
        where: {
          id: idEvento
        }
      })
      .then(resp => {

        if (!resp) {
          return dbResolve(new ResultadoServico('Evento não encontrado', StatusServico.Erro));
        }

        return db.sequelize.query(
          `
          SELECT q.id AS idQuestionario, p.id AS idPergunta, op.id AS idOpcaoResposta, q.nome AS questionario, eq.quantidadePorEnquete, p.descricao AS pergunta, p.tipoResposta, op.descricao AS opcaoResposta
          FROM questionarios AS q
          LEFT JOIN eventosQuestionarios AS eq ON eq.idQuestionario = q.id
          LEFT JOIN questionarioPerguntas qp ON q.id = qp.idQuestionario
          LEFT JOIN perguntas p ON p.id = qp.idPergunta
          LEFT JOIN perguntasOpcoesResposta pop ON pop.idPergunta = p.id
          LEFT JOIN opcoesResposta op ON op.id = pop.idOpcaoResposta
          WHERE eq.idEvento = ${idEvento}
          ORDER BY eq.ordem, p.id, pop.ordem;
          `, {raw: true})
        .then(respOpcoes => {
          let opcoes = respOpcoes[0];
          const numeroEntrevistasMock = 30;

          let entrevistas: Entrevista[] = [];
          let now = Date.now();
          for(let i = 0; i < numeroEntrevistasMock; i++) {
            let e = new Entrevista(idEvento, idUsuario, 'Fulano Mock ' + now + '_' + i);
            e.id = null;
            e.concluida = true;
            entrevistas.push(e);
          }

          return db.entrevistas.bulkCreate(entrevistas, {transaction: t})
          .then((respBulkEntrevistas) => {

            let grupoQuestionarios = _.groupBy(opcoes, 'idQuestionario');
            let questionarios = Object.keys(grupoQuestionarios).map((k) => grupoQuestionarios[k]);

            let questionariosRespondidos: QuestionarioRespondido[] = [];

            respBulkEntrevistas.forEach(entrevista => {
              questionarios.forEach(opcoesDoQuestionario => {
                let opcaoZero = opcoesDoQuestionario[0];
                if (!opcaoZero) {
                  return;
                }

                let numeroQ = 0;
                switch(parseInt(opcaoZero.quantidadePorEnquete)){
                  case QtdQuestionarioPorEnquete.apenasUm: {numeroQ = 1; break;}
                  case QtdQuestionarioPorEnquete.peloMenosUm: {numeroQ = Math.floor(Math.random() * 5) + 1; break;} // 1 a 5;
                  case QtdQuestionarioPorEnquete.opcional: {numeroQ = Math.floor(Math.random() * 3); break;} // 0, 1 ou 2;
                }

                for(let i=1; i<=numeroQ; i++){

                  let qr = new QuestionarioRespondido(entrevista.id, opcaoZero.idQuestionario);
                  qr.id = null;
                  if (Math.floor(Math.random() * 3) === 0) { // 1 em cada 3
                    qr.observacoes = 'Obs mock ' + Date.now();
                  }

                  questionariosRespondidos.push(qr);
                }
              });
            });

            return db.questionariosRespondidos.bulkCreate(questionariosRespondidos, {transaction: t})
            .then((respBulkQRespondidos) => {

              let respostas: Resposta[] = [];

              respBulkQRespondidos.forEach(qRespondido => {

                let opcoesDoQuestionario: any[] = _.filter(opcoes, {idQuestionario: qRespondido.idQuestionario});
                let grupoPerguntas = _.groupBy(opcoesDoQuestionario, 'idPergunta');
                let perguntas = Object.keys(grupoPerguntas).map((k) => grupoPerguntas[k]);

                perguntas.forEach(opcoesDaPergunta => {
                  let opcaoZero = opcoesDaPergunta[0];
                  if (!opcaoZero) {
                    return;
                  }

                  let resposta = new Resposta();
                  resposta.id = null;
                  resposta.idQuestionarioRespondido = qRespondido.id;
                  resposta.idPergunta = opcaoZero.idPergunta;
    
                  if (opcaoZero.tipoResposta === TipoResposta.MultiplaEscolha) {
                    let opcaoEscolhidaAoAcaso = Math.floor(Math.random() * opcoesDaPergunta.length);
                    resposta.idOpcaoEscolhida = opcoesDaPergunta[opcaoEscolhidaAoAcaso].idOpcaoResposta;
                  }
                  else if (opcaoZero.tipoResposta === TipoResposta.Numero) {
                    resposta.respostaEmNumero = Math.floor(Math.random() * 20) + 1; // resposta de 1 a 20
                  }
                  else if (opcaoZero.tipoResposta === TipoResposta.Texto) {
                    resposta.respostaEmTexto = 'Resposta em texto exemplo ' + Date.now() + '.';
                  }
    
                  if (Math.floor(Math.random() * 10) + 1 === 10) {
                    resposta.observacoes = 'Observação mock ' + Date.now();
                  }
    
                  respostas.push(resposta);
                });
              });

              return db.respostas.bulkCreate(respostas, {transaction: t})
              .then((respBulkRespostas) => {

                return dbResolve(new ResultadoServico({
                  entrevistas: respBulkEntrevistas,
                  questionariosRespondidos: respBulkQRespondidos,
                  respostas: respBulkRespostas
                }));
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

export function relatorio(idEvento: number, idPergunta?: number) : Promise<ResultadoServico> {
  let query = `
    SELECT
      ev.nome AS evento,

      (SELECT COUNT(e.id) FROM entrevistas e WHERE e.idEvento = ev.id) AS qtdEntrevistas,

      q.nome AS questionario,
      q.id AS idQuestionario,

      (CASE
          WHEN evQ.quantidadePorEnquete = 1 THEN 'Um'
          WHEN evQ.quantidadePorEnquete = 2 THEN 'Um ou mais'
          WHEN evQ.quantidadePorEnquete = 3 THEN 'Opcional' END) AS qtdQuestPorEntrevista,

      (SELECT COUNT(qr.id) FROM entrevistas e
        LEFT JOIN questionariosRespondidos qr ON qr.idEntrevista = e.id
        WHERE e.idEvento = ev.id AND qr.idQuestionario = q.id) AS qtdQuestRespondidos,

      p.descricao AS pergunta,
      p.id AS idPergunta,
      p.tipoResposta,

      op.descricao AS opcaoResposta,
      op.id AS idOpcaoResposta,

      (SELECT COUNT(r.id) FROM entrevistas e
        LEFT JOIN questionariosRespondidos qr ON qr.idEntrevista = e.id
        LEFT JOIN respostas r ON r.idQuestionarioRespondido = qr.id
        WHERE e.idEvento = ev.id AND qr.idQuestionario = q.id
        AND r.idPergunta = p.id AND r.idOpcaoEscolhida = op.id) AS qtdEscolhas,

      (SELECT AVG(r.respostaEmNumero) FROM entrevistas e
        LEFT JOIN questionariosRespondidos qr ON qr.idEntrevista = e.id
        LEFT JOIN respostas r ON r.idQuestionarioRespondido = qr.id
        WHERE e.idEvento = ev.id
        AND qr.idQuestionario = q.id AND r.idPergunta = p.id) AS mediaRespNumero,

      evQ.ordem AS ordemQuestionario,
      qp.ordem AS ordemPergunta,
      pOp.ordem AS ordemOpcao

    FROM eventos ev
    JOIN eventosQuestionarios evQ ON evQ.idEvento = ev.id
    JOIN questionarios q ON q.id = evQ.idQuestionario
    JOIN questionarioPerguntas qp ON qp.idQuestionario = q.id
    JOIN perguntas p ON p.id = qp.idPergunta
    LEFT JOIN perguntasOpcoesResposta pOp ON pOp.idPergunta = p.id
    LEFT JOIN opcoesResposta op ON op.id = pOp.idOpcaoResposta

    WHERE ev.id = ${idEvento} ${!!idPergunta ? `AND p.id = ${idPergunta}` : ''}
    ORDER BY evQ.ordem, qp.ordem, pOp.ordem;
  `;

  return new Promise((resolve, reject) => {

    db.sequelize.query(query, {raw: true, type: Sequelize.QueryTypes.SELECT})
    .then(resp => {

      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
}

export function respostas(idEvento: number, idPergunta: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    const query = `SELECT e.nome AS entrevistado,
    u.nome AS entrevistador, e.createdAt AS dataEntrevista, op.descricao AS opcaoEscolhida, r.*
    FROM respostas r
    LEFT JOIN questionariosRespondidos qr ON r.idQuestionarioRespondido = qr.id
    LEFT JOIN entrevistas e ON qr.idEntrevista = e.id
    LEFT JOIN usuarios u ON e.idUsuario = u.id
    LEFT JOIN opcoesResposta op ON r.idOpcaoEscolhida = op.id
    WHERE e.idEvento = ${idEvento} AND r.idPergunta = ${idPergunta}`;

    db.sequelize.query(query, {raw: true, type: Sequelize.QueryTypes.SELECT})
    .then(resp => {
      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
}

export function cruzamento(idEvento: number, cruzamento: Cruzamento) : Promise<ResultadoServico> {
  let query = `
    SELECT
    opAmostragem.id as idEscolhaAmostragem,
    count(rAmostragem.id) as quantidade
    FROM entrevistas eUniverso
        LEFT JOIN questionariosRespondidos qrUniverso ON qrUniverso.idEntrevista = eUniverso.id
        LEFT JOIN respostas rUniverso ON rUniverso.idQuestionarioRespondido = qrUniverso.id
        LEFT JOIN perguntas pUniverso ON pUniverso.id = rUniverso.idPergunta
        LEFT JOIN opcoesResposta opUniverso ON rUniverso.idOpcaoEscolhida = opUniverso.id
        left join questionariosRespondidos qrAmostragem on qrAmostragem.idEntrevista = eUniverso.id
        left join respostas rAmostragem on rAmostragem.idQuestionarioRespondido = qrAmostragem.id
        left join perguntas pAmostragem on rAmostragem.idPergunta = pAmostragem.id
        left join opcoesResposta opAmostragem on opAmostragem.id = rAmostragem.idOpcaoEscolhida
    WHERE eUniverso.idEvento = ${idEvento} AND eUniverso.concluida = 1
    AND qrUniverso.idQuestionario = ${cruzamento.idQrUniverso} AND rUniverso.idPergunta = ${cruzamento.idPerguntaUniverso} AND rUniverso.idOpcaoEscolhida = ${cruzamento.idOpEscolhidaUniverso}
    and qrAmostragem.idQuestionario = ${cruzamento.idQrAmostragem} and rAmostragem.idPergunta = ${cruzamento.idPerguntaAmostragem}
    group by rAmostragem.idOpcaoEscolhida ORDER by opAmostragem.id;
  `;

  return new Promise((resolve, reject) => {

    db.sequelize.query(query, {raw: true, type: Sequelize.QueryTypes.SELECT})
    .then(resp => {

      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
}