import * as express from 'express';
import { Container } from 'inversify';
import * as fs from 'fs';
const expressJwt = require('express-jwt');
import container from '../../common/config/ioc_config';
import { UserRole } from '../../common/models/security.model';

function authMiddlewareFactory(container: Container) {
  return (config: UserRole) => {
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
            // Check if token is valid
            if (err) {
              res.status(401).end('Unauthorized');
            } else {
              // If the token is valid, req.user will be set with the JSON object decoded
              let obj: any = req;
              if (
                config.role !== undefined &&
                obj.user.role !== undefined &&
                config.role === obj.user.role
              ) {
                next();
              } else {
                res.status(401).end('Unauthorized role');
              }
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
