import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from './organizacao-controller';

export function aplicarRotas(base: string, server: Server) {
  server.get(`${base}/organizacoes/:id`, controller.obter);
  server.put(`${base}/organizacoes/:id`, somenteAdm, controller.editar);
  //server.del(`${base}/organizacoes/:id`, somenteAdm, controller.excluir);
}