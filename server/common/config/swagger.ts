import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as express from 'express';

/**
* Add Swagger Middleware and setup the UI route for swagger
 * @param app Express App
 */
export function swaggerify (exApp: express.Application, middleware) {
     // Add all the Swagger Express Middleware, or just the ones you need.
  // NOTE: Some of these accept optional options (omitted here for brevity)

  exApp.enable('case sensitive routing');
  exApp.enable('strict routing');

  exApp.use(middleware.metadata());
  exApp.use(
    middleware.files(exApp, {
      apiPath: process.env.SWAGGER_API_DOCS_ROOT,
      rawFilesPath: process.env.SWAGGER_API_DOCS_ROOT,
    })
  );

  exApp.use(
    middleware.parseRequest({
      // Configure the cookie parser to use secure cookies
      cookie: {
        secret: process.env.SESSION_SECRET
      },
      // Don't allow JSON content over 100kb (default is 1mb)
      json: {
        limit: process.env.REQUEST_LIMIT
      }
    })
  );

  // CORS enabled for production builds
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.CORS === 'true'
  ) {
    exApp.use(middleware.metadata());
    exApp.use(middleware.CORS());    
  }

  exApp.use(middleware.validateRequest());
    
  

  const swaggerDocument = YAML.load('./server/common/swagger/Api.yaml');
  exApp.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
