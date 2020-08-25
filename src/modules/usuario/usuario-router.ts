import {Server} from 'restify';
import * as controller from './usuario-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/usuarios`, controller.criar);

  server.get(`${base}/usuarios`, controller.listar);
  server.get(`${base}/usuarios/:id`, controller.obter);
  server.put(`${base}/usuarios/:id`, controller.editar);
  server.del(`${base}/usuarios/:id`, controller.excluir);
  server.get(`${base}/usuarios/perfil`, controller.perfil);
  server.put(`${base}/usuarios/senha`, controller.alterarSenha);
}