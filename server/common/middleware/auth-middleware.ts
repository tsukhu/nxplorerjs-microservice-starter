import * as express from 'express';
import { Container } from 'inversify';
import * as fs from 'fs';
const expressJwt = require('express-jwt');
import container from '../../common/config/ioc_config';
import { User } from '../../common/models/security.model';

const authMiddlewareFactory = () => {
  return (config: User) => {
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
          expressJwt({ secret: RSA_PUBLIC_KEY })(req, res, err => {
            // Check if token is valid
            if (err) {
              res.status(401).end('Unauthorized');
            } else {
              // If the token is valid, req.user will be set with the JSON object decoded
              const obj: any = req;
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
};

const authGraphQLMiddlewareFactory = () => {
  return (req, res, next) => {
    console.log('Middleware called');

    // If the token is valid, req.user will be set with the JSON object decoded
    const obj: any = req;
    if (obj.user.role !== undefined && 'test' === obj.user.role) {
      next();
    } else {
      res.status(401).end('Unauthorized role');
    }
  };
};

export const checkUser = async (user: any): Promise<any> => {
  if (user.role !== undefined && 'admin' === user.role) {
    return Promise.resolve(user);
  } else {
    return Promise.reject('Unauthorised User');
  }
};

export const getAuthenticatedUser = ctx => {
  if (process.env.JWT_AUTH === 'true') {
    return checkUser(ctx.user);
  } else {
    return Promise.resolve(ctx);
  }
};

const authMiddleware = authMiddlewareFactory();
const graphQLAuthMiddleware = authGraphQLMiddlewareFactory();
export { authMiddleware, graphQLAuthMiddleware };
