import * as express from 'express';
import { Container } from 'inversify';
import * as fs from 'fs';
const expressJwt = require('express-jwt');
import container from '../../common/config/ioc_config';

function authMiddlewareFactory(container: Container) {
  return () => {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      (async () => {
        if (process.env.JWT_AUTH === 'true') {
          const RSA_PUBLIC_KEY = fs.readFileSync(
            process.env.RSA_PUBLIC_KEY_FILE
          );
          expressJwt({ secret: RSA_PUBLIC_KEY })(req, res, function(err) {
            if (err) {
              res.status(401).end('Unauthorized');
            } else {
              next();
            }
          });
        } else {
          next();
        }
      })();
    };
  };
}

const authMiddleware = authMiddlewareFactory(container);

export { authMiddleware };
