import * as jwt from 'jsonwebtoken';
import db from '../database/db-connection';

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

export function verificaOrg(req, res, next) {
  const token : string = req.headers['authorization'].toString().replace('Bearer ', '');
  const usuario = jwt.verify(token, serverConf.jwt.secret)['data'] as Usuario;

  db.usuarios.find({where: {id: usuario.id, idOrganizacao: usuario.idOrganizacao}}).then((lista) => {
    console.log('PASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSOU')
    if (!lista) {
      res.send(403, "Acesso negado.");
    }else{
      next();
    }
  });
}