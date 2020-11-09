import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from '../evento/evento-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/eventos`, somenteAdm, controller.criar);

  server.get(`${base}/eventos`, controller.listar);
  server.get(`${base}/eventos/:id`, controller.obter);
  server.get(`${base}/eventos/todos`, controller.obterTodos);
  server.get(`${base}/eventos/:id/questionarios`, controller.obterQuestionarios);
  server.put(`${base}/eventos/:id`, somenteAdm, controller.atualizar);
  server.del(`${base}/eventos/:id`, somenteAdm, controller.excluir);

  server.post(`${base}/eventos/:id/preencher-mock`, somenteAdm, controller.preencherMock);

  server.get(`${base}/eventos/:idEvento/relatorio`, controller.relatorio);
  server.get(`${base}/eventos/:idEvento/pergunta/:idPergunta/relatorio`, controller.relatorio);
  server.get(`${base}/eventos/:idEvento/pergunta/:idPergunta/respostas`, controller.respostas);
}