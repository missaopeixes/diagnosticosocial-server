
import db from '../../database/db-connection';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const serverConf = require('../../server.json');

export function signin(login: string, senha: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.usuarios.findOne({
      where: {
        login: login
      }
    })
    .then(resp => {

      if (!resp || !resp.id) {
        return resolve(new ResultadoServico('Credenciais inválidas.', StatusServico.Erro, TipoErro.Autenticacao));
      }

      bcrypt.compare(senha, resp.senha, (err, isMatch) => {
        if (err) throw err;

        if (!isMatch) {
          return resolve(new ResultadoServico('Credenciais inválidas, senha inválida.', StatusServico.Erro, TipoErro.Autenticacao));
        }

        const token = jwt.sign({data: resp}, serverConf.jwt.secret, {expiresIn: serverConf.jwt.expiresIn});
  
        resolve(new ResultadoServico({login, nome: resp.nome, token, validade: serverConf.jwt.expiresIn}));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};