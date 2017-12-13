import * as express from 'express';
import { Application } from 'express';
import * as partialResponse from 'express-partial-response';
import * as path from 'path';
import * as http from 'http';
import * as os from 'os';
import * as Brakes from 'brakes';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { swaggerify } from './config/swagger';
import { secureApp } from './config/security';
import myGraphQLSchema from '../graphql/schema';
import container from '../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../common/constants/identifiers';
import {
  interfaces,
  InversifyExpressServer,
  TYPE
} from 'inversify-express-utils';
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
    } else {
      root = path.normalize('.');
    }

    this.server = new InversifyExpressServer(container, undefined, {
      rootPath: '/api/v1'
    });
    this.server.setConfig(app => {
      app.set('appPath', root + 'client');
      // Add security configuration
      secureApp(app);
      app.use(express.static(`${root}/public`));
      app.use(responseTime({ suffix: false }));
      app.use(partialResponse());
      app.use((req: any, res, next) => {
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
      app.get(
        '/graphiql',
        graphiqlExpress({
          endpointURL: '/graphql',
          subscriptionsEndpoint: `ws://localhost:${
            process.env.PORT
          }/subscriptions`
        })
      ); // if you want GraphiQL enabled

      // Add swagger support
      swaggerify(app);
    });
  }

  public getServer(): InversifyExpressServer {
    return this.server;
  }
}
