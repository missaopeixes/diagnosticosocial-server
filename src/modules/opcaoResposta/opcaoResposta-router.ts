import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from './opcaoResposta-controller';

export function aplicarRotas(base: string, server: Server) {

  server.get(`${base}/opcoes-resposta/pesquisa`, controller.pesquisar);
  server.post(`${base}/opcoes-resposta`, somenteAdm, controller.criar);
}