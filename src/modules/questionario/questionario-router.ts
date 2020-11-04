import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from './questionario-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/questionarios`, somenteAdm, controller.criar);

  server.get(`${base}/questionarios`, controller.listar);
  server.get(`${base}/questionarios/todos`, controller.listarTodos);
  server.get(`${base}/questionarios/:id`, controller.obter);
  server.put(`${base}/questionarios/:id`, somenteAdm, controller.atualizar);
  server.del(`${base}/questionarios/:id`, somenteAdm, controller.excluir);
  server.get(`${base}/questionarios/:id/perguntas`, controller.obterPerguntas);

  server.post(`${base}/questionarios/:id/perguntas`, somenteAdm, controller.criarPergunta);

  server.put(`${base}/questionarios/:id/perguntas/:idPergunta`, somenteAdm, controller.vincularPergunta);
  server.del(`${base}/questionarios/:id/perguntas/:idPergunta`, somenteAdm, controller.desvincularPergunta);
}