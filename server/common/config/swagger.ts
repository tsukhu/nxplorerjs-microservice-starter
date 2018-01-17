import * as swaggerMiddleware from 'swagger-express-middleware';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as express from 'express';

/**
 * Add Swagger Middleware and setup the UI route for swagger
 * @param app Express App
 */
export const swaggerify = (app: express.Application) => {
  // Add Swagger support
  swaggerMiddleware(
    './server/common/swagger/Api.yaml',
    app,
    (err, middleware) => {
      app.enable('case sensitive routing');
      app.enable('strict routing');

      app.use(middleware.metadata());
      app.use(
        middleware.files(app, {
          apiPath: process.env.SWAGGER_API_DOCS_ROOT
        })
      );

      app.use(
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
        app.use('/api/*', middleware.metadata(), middleware.CORS());
      }

      app.use(middleware.validateRequest());
      // Error handler to display the validation error as HTML
      app.use((err, req, res, next) => {
        res.status(err.status);
        res.send(
          '<h1>' + err.status + ' Error</h1>' + '<pre>' + err.message + '</pre>'
        );
      });
    }
  );

  const swaggerDocument = YAML.load('./server/common/swagger/Api.yaml');
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
