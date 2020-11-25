import db from '../../database/db-connection';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuario/usuario-model';
import { recuperarSenha } from '../usuario/usuario-service';
import { Auth } from './auth-model';

const nodemailer = require('nodemailer');

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

        resolve(new ResultadoServico(new Auth({
          login,
          id: resp.id,
          nome: resp.nome,
          administrador: resp.administrador,
          validade: serverConf.jwt.expiresIn,
          token
        })));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function solicitarNovaSenha(email: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.usuarios.findOne({
      where: {
        email: email
      }
    })
    .then(resp => {

      if (!resp || !resp.id) {
        return resolve(new ResultadoServico('Credenciais inválidas.', StatusServico.Erro, TipoErro.Autenticacao));
      }

      //email de confirmação
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'dev.missaopeixes@gmail.com',
          accessToken: 'AIzaSyDoRzPJfqzIXk3XRqdQpU-lHbU9XNNfrLc'
        }
      });

      transporter.set('oauth2_provision_cb', (user, renew, callback) => {
        let accessToken = 'AIzaSyDoRzPJfqzIXk3XRqdQpU-lHbU9XNNfrLc';
        if(!accessToken){
            return callback(new Error('Unknown user'));
        }else{
            return callback(null, accessToken);
        }
      });

      const tokenLink = jwt.sign({data: resp}, serverConf.jwtNewPass.secret, {expiresIn: serverConf.jwtNewPass.expiresIn});
      
      var mailOptions = {
        from: 'dev.missaopeixes@gmail.com',
        to: email,
        subject: 'Diagnóstico Social - Solicitação para troca de senha',
        html: `
            <div>
              <div style="
                width: 100%;
                height: 4.3rem;
                background-color: #eee;
                box-shadow: 0px 5px 10px lightgrey;
              ">
                <p style="
                  color: #333;
                  float: left;
                  margin: 0;
                  font-size: 20px;
                  line-height: 68px;
                ">
                <img src="http://missaoapps.com.br/assets/logo.png" style="
                  width: 88px;
                  margin: 0.4rem;
                  float: left;
                "/>
                Diagnóstico Social
                </p>
              </div>
              <div style="
                padding: 2rem;
                padding-top: 0;
                text-align: center;
              ">
                <h2 style="
                  color: #333;
                ">
                  Olá, ${resp.nome}!
                </h2>
                <p style="
                  font-size: large;
                  color: #333;
                ">
                  Este email foi enviado automaticamente pelo sistema referente a uma solicitação de troca de senha. 
                  Se você não reconhece esta atividade, por favor ignore este email. Caso queira alterar a senha de sua 
                  conta, acesse o link abaixo:
                </p><br>
                <a href="http://missaoapps.com.br/recuperacao/validacao?token=${tokenLink}" style="
                  background-color: #289c93;
                  border-radius: 8px;
                  text-decoration: none;
                  padding: 1rem;
                  font-size: large;
                  color: white;
                  font-weight: bold;
                ">Alterar Senha</a><br><br><br>
                <b style="color: #333;">Este link permanecerá funcionando por 1 hora a partir de sua emissão!</b><br>
                <p style="color: #333;">Caso o botão não funcione, utilize a URL a seguir:</p>
                <i style="color: #289c93;">http://missaoapps.com.br/recuperacao/validacao?token=${tokenLink}</i><br><br><hr>
                <img src="http://missaoapps.com.br/assets/logo-missao.png" width="200" style="
                  margin-to: 1rem;
                "/>
              </div>
            </div>`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.error('erro: '+ error);
          return reject(new ResultadoServico(error, StatusServico.Erro, TipoErro.Excecao));
        }

        console.log('Email sent: '+info.response);
        resolve(new ResultadoServico({mensagem: 'O email foi enviado com sucesso para '+email+'.'}));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function validarSolicitacao(token: string) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    const usuario = jwt.verify(token, serverConf.jwtNewPass.secret)['data'] as Usuario;

    db.usuarios.findOne({
      where: {
        id: usuario.id,
        login: usuario.login,
        nome: usuario.nome,
        email: usuario.email
      }
    })
    .then(resp => {
      
      if (!resp || !resp.id) {
        return resolve(new ResultadoServico('Credenciais inválidas.', StatusServico.Erro, TipoErro.Autenticacao));
      }
      
      resolve(new ResultadoServico({mensagem: 'Token válido!', usuario: resp}));
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};

export function alterarSenha(novaSenha: string, usuario: Usuario) : Promise<ResultadoServico> {
  return new Promise((resolve, reject) => {

    db.usuarios.findOne({
      where: {
        id: usuario.id
      }
    })
    .then(resp => {
      if (!resp || !resp.id) {
        return resolve(new ResultadoServico('Credenciais inválidas.', StatusServico.Erro, TipoErro.Autenticacao));
      }

      recuperarSenha(resp.id, novaSenha).then(result => {

        if (result.status === StatusServico.Erro) {
          reject(new ResultadoServico(result.conteudo, StatusServico.Erro, TipoErro.Excecao));
        }

        resolve(new ResultadoServico({mensagem: 'Senha alterada com sucesso!'}));
      })
      .catch(err => {
        reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
      });
    })
    .catch(err => {
      reject(new ResultadoServico(err, StatusServico.Erro, TipoErro.Excecao));
    });
  });
};