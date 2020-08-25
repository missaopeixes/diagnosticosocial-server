import {Server} from 'restify';
import * as controller from './entrevista-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/entrevistas`, controller.criar);

  server.get(`${base}/entrevistas`, controller.listar);
  server.get(`${base}/entrevistas/:id`, controller.obter);
  server.put(`${base}/entrevistas/:id`, controller.atualizar);
  server.del(`${base}/entrevistas/:id`, controller.excluir);

  server.post(`${base}/entrevistas/:idEntrevista/questionario-respondido`, controller.salvarQuestionarioRespondido);

  server.put(`${base}/entrevistas/:idEntrevista/questionario-respondido/:id`, controller.atualizarQuestionarioRespondido);
  server.get(`${base}/entrevistas/:idEntrevista/questionario-respondido/:id/respostas`, controller.obterRespostasQuestionario);
  server.del(`${base}/entrevistas/:idEntrevista/questionario-respondido/:id`, controller.excluirQuestionarioRespondido);
}