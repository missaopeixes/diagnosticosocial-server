import {Server} from 'restify';
import { somenteAdm, verificaOrg } from '../../utils/permission-utils';
import * as controller from './pergunta-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/perguntas`, verificaOrg, somenteAdm, controller.criar);

  server.get(`${base}/perguntas`, verificaOrg, controller.listar);
  server.get(`${base}/perguntas/pesquisa`, verificaOrg, controller.pesquisar);
  server.get(`${base}/perguntas/:id`, verificaOrg, controller.obter);
  server.put(`${base}/perguntas/:id`, verificaOrg, somenteAdm, controller.atualizar);
  server.del(`${base}/perguntas/:id`, verificaOrg, somenteAdm, controller.excluir);

  server.post(`${base}/perguntas/:id/opcoes-resposta`, verificaOrg, somenteAdm, controller.criarResposta);

  server.put(`${base}/perguntas/:id/opcoes-resposta/:idOpcaoResposta`, verificaOrg, somenteAdm, controller.vincularResposta);
  server.get(`${base}/perguntas/:id/opcoes-resposta/:idOpcaoResposta/validacao-desvinculo`, verificaOrg, somenteAdm, controller.validarDesvinculoResposta);
}