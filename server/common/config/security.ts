import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as csrf from 'csurf';
import * as fs from 'fs';
const expressJwt = require('express-jwt');

/**
 * Add Security Settings for the Express App
 * @param app Express App
 */
export function secureApp(app: express.Application) {
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cookieParser(process.env.SESSION_SECRET));
  //   app.use(logger(bunyanOpts));
  app.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'production' && process.env.CORS === 'true') {
    app.use(csrf({ cookie: true }));
  }

  if (process.env.JWT_AUTH === 'true') {
    const RSA_PUBLIC_KEY = fs.readFileSync(process.env.RSA_PUBLIC_KEY_FILE);
    app.get('/api/v1/examples', expressJwt({ secret: RSA_PUBLIC_KEY }));
   /* app.use(
      expressJwt({ secret: RSA_PUBLIC_KEY }).unless({
        path: [
          { url: '/graphql' , methods: ['GET', 'PUT' ,'DELETE', 'POST'] },
          { url: '/swagger/' , methods: ['GET', 'PUT' ,'DELETE', 'POST'] },
          { url: '/graphiql/' },
          { url: '/login/' },
          { url: '/' },
          { url: '/playground/' }
        ]
      })
    );
    */
  }

  app.use((req: any, res, next) => {
    // write the csrf cookie in the response in the ‘XSRF-TOKEN’ field
    // The client must pass 'x-xsrf-token' or 'x-csrf-token'
    // or 'xsrf-token' or 'csrf-token' in the header with the value set
    if (process.env.NODE_ENV === 'production' && process.env.CORS === 'true') {
      res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
  });
}
