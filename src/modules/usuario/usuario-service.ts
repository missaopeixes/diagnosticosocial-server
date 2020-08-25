
import db from '../../database/db-connection';
import { Usuario } from './usuario-model';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import * as crudUtils from '../../utils/crud-utils';
import * as bcrypt from 'bcrypt';

const PASSWORD_SALT_ROUNDS = 10;

export function criar(nome: string, login: string, email: string, senha: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {
    
    const usuario = new Usuario();
    usuario.nome = nome;
    usuario.login = login;
    usuario.email = email;
    usuario.senha = senha;

    usuario.validar().then(erros => {

      if (erros.length > 0) {
        return resolve(new ResultadoServico(erros, StatusServico.Erro));
      }

      db.usuarios.find({where: {login: usuario.login}}).then((lista) => {
        if (!!lista) return resolve(new ResultadoServico('Este login já está sendo utilizado!', StatusServico.Erro));

        return db.usuarios.find({where: {email: usuario.email}}).then((lista) => {
          if (!!lista) return resolve(new ResultadoServico('Este endereço e-mail já está sendo utilizado por outro usuário.', StatusServico.Erro));

          bcrypt.hash(usuario.senha, PASSWORD_SALT_ROUNDS, (err, hash) => {

            if (err) {
              return resolve(new ResultadoServico(erros, StatusServico.Erro, TipoErro.Excecao));
            }

            usuario.senha = hash;

            db.usuarios.create(usuario).then(resp => {
    
              resolve(new ResultadoServico(resp));
            });
          });
        }); 
      })
      .catch(err => {
        reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
      });

    });
  });
};

export function editar(idUsuario: number, nome: string, login: string, email: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {
    
    const usuario = new Usuario();
    usuario.id = idUsuario;
    usuario.nome = nome;
    usuario.login = login;
    usuario.email = email;

    usuario.validar().then(erros => {

      if (erros.length > 0) {
        return resolve(new ResultadoServico(erros, StatusServico.Erro));
      }

      db.usuarios.findOne({where: {id: usuario.id}}).then((obj) => {
        if (!obj) return resolve(new ResultadoServico('Usuário inexistente!', StatusServico.Erro));

        db.usuarios.update({
          nome: usuario.nome,
          login: usuario.login,
          email: usuario.email
        }, {where: {id: idUsuario}}).then(resp => resolve(new ResultadoServico(resp))); 
      })
      .catch(err => reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao)));

    });
  });
};

export function listar(pagina?: number, itensPorPagina?: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.usuarios.findAll(crudUtils.montarPaginacao(pagina, itensPorPagina))
    .then(resp => {
      const lista = resp.map((u) => {
        delete u.senha;
        return u;
      });

      return crudUtils.montarConteudoPagina(lista, pagina, itensPorPagina);
    })
    .then((resultado) => {
      db.usuarios.count().then((count) => {
        resultado.total = count;
        return resolve(new ResultadoServico(resultado));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function obter(id: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.usuarios.findOne({
      where: {
        id: id
      }
    })
    .then(resp => {
      resolve(new ResultadoServico(resp));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function excluir(id: number, idUsuarioSessao: number) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    if (id === idUsuarioSessao)
      return resolve(new ResultadoServico('Não é possível excluir o usuário da própria sessão.', StatusServico.Erro));

    db.usuarios.findOne({where: {id: id}}).then(usuario => {
      if (!usuario) return resolve(new ResultadoServico('Usuário não encontrado', StatusServico.Erro));

      db.entrevistas.findOne({where: {idUsuario: id}}).then(resp => {
        if (!!resp) return resolve(new ResultadoServico('Não é possível excluir este usuário pois possui entrevistas vinculadas.', StatusServico.Erro));

        db.usuarios.destroy({where: {id: usuario.id}})
          .then(resp => resolve(new ResultadoServico(resp)))
      })
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  })
};

export function alterarSenha(idUsuario: number, senhaAtual: string, novaSenha: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.usuarios.findOne({where: {id: idUsuario}}).then(usuario => {

      if (!usuario) return resolve(new ResultadoServico('Usuário não encontrado', StatusServico.Erro, TipoErro.Excecao));

      bcrypt.compare(senhaAtual, usuario.senha, (err, isMatch) => {
        if (err) throw err;

        if (!isMatch) return resolve(new ResultadoServico('Senha atual inválida', StatusServico.Erro, TipoErro.Excecao));

        bcrypt.hash(novaSenha, PASSWORD_SALT_ROUNDS, (err, hashNovo) => {
          if (err) throw err;

          return db.usuarios.update({
            senha: hashNovo
          }, {where: {id: idUsuario}}).then(resp => resolve(new ResultadoServico(resp))); 
        });
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};