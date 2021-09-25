import db from '../database/db-connection';

import { HttpUtils } from './http-utils';

export function somenteAdm(req, res, next) {
  const usuario = HttpUtils.getUserSession(req);
  
  if (!usuario.administrador) {
    res.send(403, "Acesso negado.");
  }else{
    next();
  }
}

export function verificaOrg(req, res, next) {
  const usuario = HttpUtils.getUserSession(req);

  db.usuarios.find({where: {id: usuario.id, idOrganizacao: usuario.idOrganizacao}}).then((lista) => {
    if (!lista) {
      res.send(403, "Acesso negado.");
    }else{
      next();
    }
  });
}