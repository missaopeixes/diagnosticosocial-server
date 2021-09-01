import {Server} from 'restify';
import { somenteAdm, verificaOrg } from '../../utils/permission-utils';
import * as controller from '../evento/evento-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/eventos`, verificaOrg, somenteAdm, controller.criar);

  server.get(`${base}/eventos`, verificaOrg, controller.listar);
  server.get(`${base}/eventos/:id`, verificaOrg, controller.obter);
  server.get(`${base}/eventos/todos`, verificaOrg, controller.obterTodos);
  server.get(`${base}/eventos/:id/questionarios`, verificaOrg, controller.obterQuestionarios);
  server.put(`${base}/eventos/:id`, verificaOrg, somenteAdm, controller.atualizar);
  server.del(`${base}/eventos/:id`, verificaOrg, somenteAdm, controller.excluir);

  server.post(`${base}/eventos/:id/preencher-mock`, verificaOrg, somenteAdm, controller.preencherMock);

  server.get(`${base}/eventos/:idEvento/relatorio`, verificaOrg, controller.relatorio);
  server.get(`${base}/eventos/:idEvento/pergunta/:idPergunta/relatorio`, verificaOrg, controller.relatorio);
  server.get(`${base}/eventos/:idEvento/pergunta/:idPergunta/respostas`, verificaOrg, controller.respostas);
}