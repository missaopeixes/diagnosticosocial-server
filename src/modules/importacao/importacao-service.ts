
import db from '../../database/db-connection';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import { Transaction } from 'sequelize';
import { Entrevista } from '../entrevista/entrevista-model';
import { TipoResposta } from '../../commom/tipo-resposta';
import { Resposta } from '../resposta/resposta-model';
import _ = require('lodash');
import { QuestionarioRespondido } from '../questionario/questionario-model';
import * as EventoService from '../evento/evento-service';
import * as QuestionarioService from '../questionario/questionario-service';
import { EntrevistaPlanilhaRespondida, QuestionarioImportacao, ImportacaoUsuario } from './importacao-model';

const PATH_TO_JSON_FILE = '../../floresta.json';

const data = require(PATH_TO_JSON_FILE);

const obterUsuario = (email) => {
  //@TODO fazer direito! (buscando do banco - receber db e transaction pra isso);

switch (email) {
    case 'joaoanecote@gmail.com':
      return 4;
    case 'matheusjesus.peixe@gmail.com':
      return 3;
    case 'linssthalita@gmail.com':
      return 5;
    case 'isabella_pib@hotmail.com':
    case 'isabella_pib@hotmail.con':
    case 'isaebella_pib@hotmail.com':
    case 'isabelllinda_pib@hotmail.com':
      return 6;
    case 'vhnogueira@outlook.com':
    case 'vhnoguiera@outlook.com':
      return 1;
    case 'karoline_nf@hotmail.com':
      return 7;
    case 'michele.brantes@gmail.com':
      return 8;
    case 'amandaferreira.peixe@gmail.com':
      return 9;
    case 'dijonas31@yahoo.com.br':
      return 10;
    case 'vinicinw@gmail.com':
      return 11;
    case 'thiagosv1o88@gmail.com':
    case 'thiagosv1988@gmai.com':
    case 'thiagosv1988@gmail.com':
      return 12;
    default:
      return 1;
  }

}

function _findOpcaoResposta(opSistema:string, opResp:string) {
  const bateu = opSistema.toLowerCase() === opResp.toLowerCase();
  switch (opResp) {
    case '1': return opSistema === 'Um' || opSistema === 'Uma' || bateu;
    case '2': return opSistema === 'Dois' || opSistema === 'Duas' || bateu;
    case '3': return opSistema === 'Três' || bateu;
    case '4': return opSistema === 'Quatro' || bateu;
    case '5': return opSistema === 'Cinco' || bateu;
    case '6': return opSistema === 'Seis' || bateu;
    case '7': return opSistema === 'Sete' || bateu;
    case '8': return opSistema === 'Oito' || bateu;
    case '9': return opSistema === 'Nove' || bateu;
    case '10': return opSistema === 'Dez' || bateu;
    default: return bateu;
  }
}

function _criarEntrevista(entrevista:Entrevista, _db:any, t: Transaction){
  return new Promise<ResultadoServico>((res, rej) => {
    entrevista.validar().then(erros => {

      if (erros.length > 0) {
        return res(new ResultadoServico(erros, StatusServico.Erro));
      }

      _db.entrevistas.create(entrevista, {transaction: t}).then(resp => {
        res(new ResultadoServico(resp));
      });

    })
    .catch(err => rej(err));
  })
}

function _criarQuestionarioRespondido(questionario:QuestionarioRespondido, _db:any, t: Transaction){
  return new Promise<ResultadoServico>((res, rej) => {
    questionario.validar().then(erros => {

      if (erros.length > 0) {
        return res(new ResultadoServico(erros, StatusServico.Erro));
      }

      _db.questionariosRespondidos.create(questionario, {transaction: t}).then(resp => {
        res(new ResultadoServico(resp));
      });

    })
    .catch(err => rej(err));
  })
}

function _montarImportacao(entrevistasPlanilha:any[], questionarios:QuestionarioImportacao[]):ImportacaoUsuario {
  let entrevistas:EntrevistaPlanilhaRespondida[] = [];
  let opcoesNaoAchei:string[] = [];
  let respostasNaoAchei:string[] = [];

  entrevistasPlanilha.forEach((entrevistaPlan, indexEntrevista) => {
    let respostasEntrevista:{idQuestionario:number, resposta:Resposta}[] = [];
    const nomeEntrevistado = entrevistaPlan['Nome completo'];

    Object.keys(entrevistaPlan).forEach(perguntaPlan => {
      let errP = 0;

      let respostaPlan = entrevistaPlan[perguntaPlan];
      questionarios.forEach(quest => {
        let pergunta = _.find(quest.perguntas, p => p.descricao.toLowerCase() === perguntaPlan.toLowerCase());

        if (!!pergunta) {

          let resposta = new Resposta();
          resposta.id = 0;
          resposta.idPergunta = pergunta.id;

          if (pergunta.tipoResposta === TipoResposta.MultiplaEscolha) {

            let opcaoEscolhida = _.find(pergunta.opcoesResposta, op => _findOpcaoResposta(op.descricao, respostaPlan.toString()));
            if (!!opcaoEscolhida) {
              resposta.idOpcaoEscolhida = opcaoEscolhida.id;
            }
            else {
              resposta.observacoes = respostaPlan.toString();
              if (!!respostaPlan) {
                opcoesNaoAchei.push(`[${perguntaPlan}] - Resposta: ${respostaPlan}`);
              }
            }
          }
          else if (pergunta.tipoResposta === TipoResposta.Texto) {
            resposta.respostaEmTexto = respostaPlan.toString();
          }
          else if (pergunta.tipoResposta === TipoResposta.Numero) {
            resposta.respostaEmNumero = respostaPlan.toString() ? parseFloat(respostaPlan.toString()) : 0;
          }

          respostasEntrevista.push({
            idQuestionario: quest.questionario.id,
            resposta
          });
        }
        else {
          errP++;
          if (errP === questionarios.length) {
            respostasNaoAchei.push(perguntaPlan);
          }
        }
      });
    });

    const respostasAgrupadas = _.groupBy(respostasEntrevista, r => r.idQuestionario);

    entrevistas.push({
      indexEntrevista,
      nomeEntrevistado,
      questionarios: Object.keys(respostasAgrupadas).map((k, i) => {
        return {
          idQuestionario: parseInt(k),
          respostas: respostasAgrupadas[k].map(g => g.resposta)
        }
      })
    });
  });

  return {
    entrevistas,
    logs: {
      opcoesNaoAchei,
      respostasNaoAchei
    }
  }
}

export function importar() : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    const sistema = {
      evento: 4 // Id do evento. @TODO Passar para parâmetro.
    };

    EventoService.obterQuestionarios(sistema.evento).then(rEvento => {
      Promise.all(
        rEvento.conteudo.map(q => QuestionarioService.obterPerguntas(q.id))
      )
      .then(resultPerguntas => {

        let questionarios:QuestionarioImportacao[] = [];
        rEvento.conteudo.forEach((q, i) => {
          questionarios.push({
            questionario: q,
            perguntas: resultPerguntas[i]['conteudo']
          });
        });

        const entrevistasPorMissionario = _.groupBy(data, 'Entrevistador');

        let processos = Object.keys(entrevistasPorMissionario).map(missionario => {
          let entrevistasPlanilha = entrevistasPorMissionario[missionario];
          let importacao = _montarImportacao(entrevistasPlanilha, questionarios);

          return {
            missionario,
            importacao
          };
        });

        db.sequelize.transaction((t: Transaction) => new Promise<ResultadoServico>((dbResolve, dbReject) => {

          Promise.all(processos).then(importacaoPorMissionario => {
            let logs:{missionario:string, entrevistas:number, erros:any[]}[] = [];

            let importandoEntrevistas = importacaoPorMissionario.map(processo => {
              let entrevistasOk = 0;

              const salvandoEntrevistas = processo.importacao.entrevistas.map(e => {
                return _criarEntrevista(new Entrevista(sistema.evento, obterUsuario(processo.missionario), e.nomeEntrevistado), db, t).then(entrevistaCadastrada => {
                  const idEntrevista = entrevistaCadastrada.conteudo.id;

                  const salvandoQuestionarios = e.questionarios.map(q => {
                    return _criarQuestionarioRespondido(new QuestionarioRespondido(idEntrevista, q.idQuestionario), db, t).then(qRespondidoCadastrado => {
                      const idQuestionarioRespondido = qRespondidoCadastrado.conteudo.id;

                      let respostas = q.respostas.map(r => {
                        r.idQuestionarioRespondido = idQuestionarioRespondido;
                        return r;
                      });

                      return new Promise((r, j) => {
                        db.respostas.bulkCreate(respostas, {transaction: t}).then(r).catch(j);
                      });
                    });
                  });

                  return Promise.all(salvandoQuestionarios).then(() => entrevistasOk++);
                });
              });

              return Promise.all(salvandoEntrevistas).then(() => {
                logs.push({
                  missionario: processo.missionario,
                  entrevistas: entrevistasOk,
                  erros: processo.importacao.logs
                });
              });
            });

            return Promise.all(importandoEntrevistas).then(() => logs);
          })
          .then(success => dbResolve(new ResultadoServico(success)))
          .catch(err => dbReject(err));

        }))
        .then((resultado) => resolve(resultado))
        .catch(err => {
          reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
        });

      })
      .catch(reject);
    });
  });
};