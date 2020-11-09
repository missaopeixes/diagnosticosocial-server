import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from './pergunta-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/perguntas`, somenteAdm, controller.criar);

  server.get(`${base}/perguntas`, controller.listar);
  server.get(`${base}/perguntas/pesquisa`, controller.pesquisar);
  server.get(`${base}/perguntas/:id`, controller.obter);
  server.put(`${base}/perguntas/:id`, somenteAdm, controller.atualizar);
  server.del(`${base}/perguntas/:id`, somenteAdm, controller.excluir);

  server.post(`${base}/perguntas/:id/opcoes-resposta`, somenteAdm, controller.criarResposta);

  server.put(`${base}/perguntas/:id/opcoes-resposta/:idOpcaoResposta`, somenteAdm, controller.vincularResposta);
  server.del(`${base}/perguntas/:id/opcoes-resposta/:idOpcaoResposta`, somenteAdm, controller.desvincularResposta);
}