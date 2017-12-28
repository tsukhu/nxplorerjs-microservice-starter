import * as express from 'express';
import * as partialResponse from 'express-partial-response';
import * as path from 'path';
import { swaggerify } from './config/swagger';
import { secureApp } from './config/security';
import { configLogging } from './config/logging';
import { configMetrics } from './config/metrics';
import { configGraphQL } from './config/graphql';
// generated routes using tsoa
import { RegisterRoutes } from '../routes';
import SERVICE_IDENTIFIER from '../common/constants/identifiers';
import {
  interfaces,
  InversifyExpressServer,
  TYPE
} from 'inversify-express-utils';

const responseTime = require('response-time');

/**
 * Node Express Server setup and configuration
 */
export default class ExpressServer {
  // public server: InversifyExpressServer;
  public app: express.Express;
  constructor() {
    let root: string;

    // Setup application root
    if (process.env.NODE_ENV === 'development') {
      root = path.normalize(__dirname + '/../..');
    } else {
      root = path.normalize('.');
    }

    /* this.server = new InversifyExpressServer(container, undefined, {
      rootPath: '/api/v1'
    });*/
    this.app = express();

    RegisterRoutes(this.app);
    
    // Add security configuration
    secureApp(this.app);

    // Add public folder
    this.app.use(express.static(`${root}/public`));

    // Add response time support
    // This will add x-response-time to the response headers
    this.app.use(responseTime({ suffix: false }));

    // Add partial response support
    this.app.use(partialResponse());

    // Add logging configuration
    configLogging(this.app);

    // Add metrics configuration
    configMetrics(this.app);

    // Graphql
    configGraphQL(this.app);

    // Add swagger support
    swaggerify(this.app);

  }

  public getServer(): express.Express {
    return this.app;
  }
}
