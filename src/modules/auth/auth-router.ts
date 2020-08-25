import {Server} from 'restify';
import * as controller from './auth-controller';
import * as rjwt from 'restify-jwt-community';

const JWT_SECRET = 'asdjhasdjd2312kjgkj2ge';

export function aplicarRotas(base: string, server: Server) {

  server.post(`${base}/auth`, controller.signin);
  //server.del(`${base}/auth`, controller.signout);

  server.use(
    rjwt({
      secret: JWT_SECRET
    })
    .unless({
      path: [`${base}/auth`, '/']
    })
  );
}