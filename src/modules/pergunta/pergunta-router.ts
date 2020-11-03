import {Server} from 'restify';
import * as controller from './pergunta-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/perguntas`, controller.criar);

  server.get(`${base}/perguntas`, controller.listar);
  server.get(`${base}/perguntas/pesquisa`, controller.pesquisar);
  server.get(`${base}/perguntas/:id`, controller.obter);
  server.put(`${base}/perguntas/:id`, controller.atualizar);
  server.del(`${base}/perguntas/:id`, controller.excluir);

  server.post(`${base}/perguntas/:id/opcoes-resposta`, controller.criarResposta);

  server.put(`${base}/perguntas/:id/opcoes-resposta/:idOpcaoResposta`, controller.vincularResposta);
  server.del(`${base}/perguntas/:id/opcoes-resposta/:idOpcaoResposta`, controller.desvincularResposta);
}