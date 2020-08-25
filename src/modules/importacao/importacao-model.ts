import { Questionario } from "../questionario/questionario-model";
import { Resposta } from "../resposta/resposta-model";
import { Pergunta } from "../pergunta/pergunta-model";

export interface QuestionarioImportacao {
  questionario:Questionario,
  perguntas:Pergunta[]
}

export interface QuestionarioPlanilhaRespondido {
  idQuestionario:number,
  respostas:Resposta[]
}

export interface EntrevistaPlanilhaRespondida {
  indexEntrevista:number,
  nomeEntrevistado:string,
  questionarios:QuestionarioPlanilhaRespondido[]
}

export interface ImportacaoUsuario {
  entrevistas:EntrevistaPlanilhaRespondida[],
  logs:any
}