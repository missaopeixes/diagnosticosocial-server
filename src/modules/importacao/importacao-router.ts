import {Server} from 'restify';
import * as controller from '../importacao/importacao-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/importacao/`, controller.importar);
}