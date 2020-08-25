import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import * as questionarios from './modules/questionario/questionario-router';
import * as entrevista from './modules/entrevista/entrevista-router';
import * as pergunta from './modules/pergunta/pergunta-router';
import * as opcaoResposta from './modules/opcaoResposta/opcaoResposta-router';
import * as usuario from './modules/usuario/usuario-router';
import * as evento from './modules/evento/evento-router';
import * as auth from './modules/auth/auth-router';
import * as serveStatic from 'serve-static-restify';

const BASE_API_URL = '/api/v1';

let server = restify.createServer();

/** 
 * Cors
 */
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: ['*'],
});

/** 
 * Middlewares
 */
server.pre(cors.preflight);
server.use(cors.actual);
server.pre(restify.pre.sanitizePath());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.authorizationParser());

/** 
 * Routes
 */
questionarios.aplicarRotas(BASE_API_URL, server);
entrevista.aplicarRotas(BASE_API_URL, server);
pergunta.aplicarRotas(BASE_API_URL, server);
opcaoResposta.aplicarRotas(BASE_API_URL, server);
usuario.aplicarRotas(BASE_API_URL, server);
evento.aplicarRotas(BASE_API_URL, server);
auth.aplicarRotas(BASE_API_URL, server);


// server.get('/', function (req, res, next) {
//   fs.readFile(__dirname + '/web-app/index.html', function (err, data) {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.write(data);
//     res.end();
//     return next();
//   });
// });

server.pre(serveStatic('public', {'index': ['index.html']} ));


/**
 * Starting
 */
server.listen(3000, (req, res) => {
  console.log('%s listening at %s', server.name, server.url);
});