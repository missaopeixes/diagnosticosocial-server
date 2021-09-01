import {Server} from 'restify';
import { somenteAdm, verificaOrg } from '../../utils/permission-utils';
import * as controller from './questionario-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/questionarios`, verificaOrg, somenteAdm, controller.criar);

  server.get(`${base}/questionarios`, verificaOrg, controller.listar);
  server.get(`${base}/questionarios/todos`, verificaOrg, controller.listarTodos);
  server.get(`${base}/questionarios/:id`, verificaOrg, controller.obter);
  server.put(`${base}/questionarios/:id`, verificaOrg, somenteAdm, controller.atualizar);
  server.del(`${base}/questionarios/:id`, verificaOrg, somenteAdm, controller.excluir);
  server.get(`${base}/questionarios/:id/perguntas`, verificaOrg, controller.obterPerguntas);

  server.post(`${base}/questionarios/:id/perguntas`, verificaOrg, somenteAdm, controller.criarPergunta);

  server.put(`${base}/questionarios/:id/perguntas/:idPergunta`, verificaOrg, somenteAdm, controller.vincularPergunta);
  server.get(`${base}/questionarios/:id/perguntas/:idPergunta/validacao-desvinculo`, verificaOrg, somenteAdm, controller.validarDesvinculoPergunta);
}