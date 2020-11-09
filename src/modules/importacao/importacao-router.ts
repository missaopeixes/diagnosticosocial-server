import {Server} from 'restify';
import { somenteAdm } from '../../utils/permission-utils';
import * as controller from '../importacao/importacao-controller';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/importacao/`, somenteAdm, controller.importar);
}