import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from './usuario-controller';

export function aplicarRotas(base: string, server: Server) {
  server.post(`${base}/usuarios`, somenteAdm, controller.criar);

  server.get(`${base}/usuarios`, somenteAdm, controller.listar);
  server.get(`${base}/usuarios/:id`, somenteAdm, controller.obter);
  server.put(`${base}/usuarios/:id`, somenteAdm, controller.editar);
  server.del(`${base}/usuarios/:id`, somenteAdm, controller.excluir);
  server.get(`${base}/usuarios/perfil`, controller.perfil);
  server.put(`${base}/usuarios/senha`, controller.alterarSenha);
}