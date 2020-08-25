import {Server} from 'restify';
import * as controller from './questionario-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/questionarios`, controller.criar);

  server.get(`${base}/questionarios`, controller.listar);
  server.get(`${base}/questionarios/todos`, controller.listarTodos);
  server.get(`${base}/questionarios/:id`, controller.obter);
  server.put(`${base}/questionarios/:id`, controller.atualizar);
  server.del(`${base}/questionarios/:id`, controller.excluir);
  server.get(`${base}/questionarios/:id/perguntas`, controller.obterPerguntas);

  server.post(`${base}/questionarios/:id/perguntas`, controller.criarPergunta);

  server.put(`${base}/questionarios/:id/perguntas/:idPergunta`, controller.vincularPergunta);
  server.del(`${base}/questionarios/:id/perguntas/:idPergunta`, controller.desvincularPergunta);
}