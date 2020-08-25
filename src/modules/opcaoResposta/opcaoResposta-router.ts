import {Server} from 'restify';
import * as controller from './opcaoResposta-controller';

export function aplicarRotas(base: string, server: Server) {

  server.get(`${base}/opcoes-resposta/pesquisa`, controller.pesquisar);
  server.post(`${base}/opcoes-resposta`, controller.criar);
}