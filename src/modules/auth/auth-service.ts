import db from '../../database/db-connection';
import { ResultadoServico, StatusServico, TipoErro } from '../../commom/resultado-servico';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuario/usuario-model';
import { recuperarSenha } from '../usuario/usuario-service';
import { Auth } from './auth-model';

const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

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

      const USER_NAME = 'Desenvolvimento Missão Peixes';
      const CLIENT_ID = '74159257235-57ckupj1hojj98odhl4cs16iabf685ds.apps.googleusercontent.com';
      const CLIENT_SECRET = 'Cv3sjWrAY7chIduqRELtyhFf';
      const REFRESH_TOKEN = '1//04VOyZkNN7ku6CgYIARAAGAQSNwF-L9IrRfPvyeJO9LSQhIP5iUBQwUzMbprqmrtcvFJfyOPJ5PuBqmiDqshO0BwZAOdTfZ4skVk';
      const ACCESS_TOKEN = 'ya29.a0AfH6SMBqu-jRdkuVAa2n7gWDJXedgRgW9Mh6iRViaQ17qdIXxYoLTu3U_YdCJmWiUk-V0nEBt9AWAHz8OXcRl2mXByIscqg7HudRjEZcng3DChoeyHw21EM5RqkAJ46utQEmKaC9E2GvxoiBAhujkA6uDTSp4wFZpkpfVVWtTUs';

      //email de confirmação
      /*let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dev.missaopeixes@gmail.com',
          pass: 'mpdev455+',
          type: 'OAuth2',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET
        }
      });*/

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dev.missaopeixes@gmail.com',
          pass: 'mpdev455+',
          xoauth2: xoauth2.createXOAuth2Generator({
            user: USER_NAME,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN
          })
        }
      });

      transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
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
                <img src="http://diagnostico.missaopeixes.org/assets/logo.png" style="
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
                <a href="http://diagnostico.missaopeixes.org/recuperacao/validacao?token=${tokenLink}" style="
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
                <i style="color: #289c93;">http://diagnostico.missaopeixes.org/recuperacao/validacao?token=${tokenLink}</i><br><br><hr>
                <img src="http://diagnostico.missaopeixes.org/assets/logo-missao.png" width="200" style="
                  margin-to: 1rem;
                "/>
              </div>
            </div>`

        /*auth : {
          user: USER_NAME,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
          expires: 1494388182480
        }*/
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