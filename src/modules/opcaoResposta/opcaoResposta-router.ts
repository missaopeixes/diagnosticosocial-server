import {Server} from 'restify';
import { somenteAdm, verificaOrg } from '../../utils/permission-utils';
import * as controller from './opcaoResposta-controller';

export function aplicarRotas(base: string, server: Server) {

  server.get(`${base}/opcoes-resposta/pesquisa`, verificaOrg, controller.pesquisar);
  server.post(`${base}/opcoes-resposta`, verificaOrg, somenteAdm, controller.criar);
}