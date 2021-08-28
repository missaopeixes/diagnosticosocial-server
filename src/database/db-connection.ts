import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';

const config = require('./config/db-connection.json');

import { QuestionariosInstance, QuestionariosAttributes } from './context/questionarios';
import { EntrevistasInstance, EntrevistasAttributes } from './context/entrevistas';
import { PerguntasInstance, PerguntasAttributes } from './context/perguntas';
import { RespostasInstance, RespostasAttributes } from './context/respostas';
import { OpcoesRespostaInstance, OpcoesRespostaAttributes } from './context/opcoesResposta';
import { QuestionarioPerguntasInstance, QuestionarioPerguntasAttributes } from './context/questionarioPerguntas';
import { PerguntasOpcoesRespostaInstance, PerguntasOpcoesRespostaAttributes } from './context/perguntasOpcoesResposta';
import { UsuariosInstance, UsuariosAttributes } from './context/usuarios';
import { OrganizacoesInstance, OrganizacoesAttributes } from './context/organizacoes';
import { EventosInstance, EventosAttributes } from './context/eventos';
import { EventosQuestionariosInstance, EventosQuestionariosAttributes } from './context/eventosQuestionarios';
import questionariosRespondidos, { QuestionariosRespondidosInstance, QuestionariosRespondidosAttributes } from './context/questionariosRespondidos';

interface DbConnection {
  questionarios: Sequelize.Model<QuestionariosInstance, QuestionariosAttributes>
  entrevistas: Sequelize.Model<EntrevistasInstance, EntrevistasAttributes>
  perguntas: Sequelize.Model<PerguntasInstance, PerguntasAttributes>
  respostas: Sequelize.Model<RespostasInstance, RespostasAttributes>
  opcoesResposta: Sequelize.Model<OpcoesRespostaInstance, OpcoesRespostaAttributes>
  questionarioPerguntas: Sequelize.Model<QuestionarioPerguntasInstance, QuestionarioPerguntasAttributes>
  questionariosRespondidos: Sequelize.Model<QuestionariosRespondidosInstance, QuestionariosRespondidosAttributes>
  perguntasOpcoesResposta: Sequelize.Model<PerguntasOpcoesRespostaInstance, PerguntasOpcoesRespostaAttributes>
  eventos: Sequelize.Model<EventosInstance, EventosAttributes>
  eventosQuestionarios: Sequelize.Model<EventosQuestionariosInstance, EventosQuestionariosAttributes>
  usuarios: Sequelize.Model<UsuariosInstance, UsuariosAttributes>
  organizacoes: Sequelize.Model<OrganizacoesInstance, OrganizacoesAttributes>
  sequelize: Sequelize.Sequelize
};

let db = {};

const dbConfig = config['development'];
const sequelize = new Sequelize(
  dbConfig['database'],
  dbConfig['username'],
  dbConfig['password'],
  dbConfig
);

const CONTEXT_PATH = __dirname + '/context';

const basename = path.basename(module.filename)
  fs
  .readdirSync(CONTEXT_PATH)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    const model = sequelize['import'](path.join(CONTEXT_PATH, file));

    db[model['name']] = model;
  });

Object.keys(db).forEach(function(modelName) {

  if (db[modelName].associate) {
    db[modelName].associate(db);
  }

});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

export default <DbConnection>db;