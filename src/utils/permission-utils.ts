import * as jwt from 'jsonwebtoken';

import { Usuario } from '../modules/usuario/usuario-model';

const serverConf = require('./../server.json');

export function somenteAdm(req, res, next) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  if (!usuario.administrador) {
    res.send(403, "Acesso negado.");
  }else{
    next();
  }
}