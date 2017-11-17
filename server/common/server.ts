import * as express from 'express';
import { Application } from 'express';
import * as partialResponse from 'express-partial-response';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as csrf from 'csurf';
import * as Brakes from 'brakes';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as middleware from 'swagger-express-middleware';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import myGraphQLSchema from '../graphql/schema';
import container from '../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../common/constants/identifiers';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';

import ILogger from '../common/interfaces/ilogger';

const LOG = container.get<ILogger>(SERVICE_IDENTIFIER.LOGGER);

const responseTime = require('response-time');

// tslint:disable-next-line:typedef
const app = express();

// Init
const Prometheus = require('prom-client');

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

export default class ExpressServer {
  public server: InversifyExpressServer;
  constructor() {
    let root: string;
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      root = path.normalize(__dirname + '/../..');
    }
    else {
      root = path.normalize('.');
    }

    this.server = new InversifyExpressServer(container, undefined, { rootPath: '/api/v1' });
    this.server.setConfig((app) => {
      app.set('appPath', root + 'client');
      app.use(bodyParser.json());
      app.use(helmet());
      app.use(cookieParser(process.env.SESSION_SECRET));
      //   app.use(logger(bunyanOpts));
      app.use(bodyParser.urlencoded({ extended: true }));

      if (process.env.NODE_ENV === 'production' && process.env.CORS === 'true') {
        app.use(csrf({ cookie: true }));
      }
      app.use(express.static(`${root}/public`));
      app.use(responseTime({ suffix: false }));
      app.use(partialResponse());
      app.use((req: any, res, next) => {
        // write the csrf cookie in the response in the ‘XSRF-TOKEN’ field
        // The client must pass 'x-xsrf-token' or 'x-csrf-token'
        // or 'xsrf-token' or 'csrf-token' in the header with the value set
        if (process.env.NODE_ENV === 'production' && process.env.CORS === 'true') {
          res.cookie('XSRF-TOKEN', req.csrfToken());
        }

        // If UUID set in the cookie then add to the log for tracking
        if (req.cookies['UUID'] !== undefined) {
          LOG.setUUID(req.cookies['UUID']);
        }
        next();
      });
      // Metrics endpoint
      app.get('/metrics', (req, res) => {
        res.set('Content-Type', Prometheus.register.contentType);
        res.end(Prometheus.register.metrics());
      });

      // Graphql
      app.use('/graphql', graphqlExpress({ schema: myGraphQLSchema }));
      app.get('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${process.env.PORT}/subscriptions`
      })); // if you want GraphiQL enabled

      // Add Swagger support
      middleware('./server/common/swagger/Api.yaml', app, function (err, middleware) {

        app.enable('case sensitive routing');
        app.enable('strict routing');

        app.use(middleware.metadata());
        app.use(middleware.files(app, {
          apiPath: process.env.SWAGGER_API_DOCS_ROOT,
        }));

        app.use(middleware.parseRequest({
          // Configure the cookie parser to use secure cookies
          cookie: {
            secret: process.env.SESSION_SECRET
          },
          // Don't allow JSON content over 100kb (default is 1mb)
          json: {
            limit: process.env.REQUEST_LIMIT
          }
        }));

        // These two middleware don't have any options (yet)
        app.use(
          middleware.CORS(),
          middleware.validateRequest());

        // Error handler to display the validation error as HTML
        app.use(function (err, req, res, next) {
          res.status(err.status);
          res.send(
            '<h1>' + err.status + ' Error</h1>' +
            '<pre>' + err.message + '</pre>'
          );
        });
      });

      const swaggerDocument = YAML.load('./server/common/swagger/Api.yaml');
      app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    });


  }

  public getServer(): InversifyExpressServer {
    return this.server;
  }

  // tslint:disable-next-line:eofline
}