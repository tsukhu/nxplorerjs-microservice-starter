import * as express from 'express';
import * as partialResponse from 'express-partial-response';
import * as path from 'path';
import {
  swaggerify,
  secureApp,
  configLogging,
  configMetrics,
  configHealthChecks,
  addCompression
} from './config';
import container from './config/ioc_config';
import { InversifyExpressServer } from 'inversify-express-utils';

const responseTime = require('response-time');

/**
 * Node Express Server setup and configuration
 */
export default class ExpressServer {
  public server: InversifyExpressServer;

  constructor() {
    let root: string;

    // Setup application root
    if (process.env.NODE_ENV === 'development') {
      root = path.normalize(__dirname + '/../..');
    } else {
      root = path.normalize('.');
    }

    this.server = new InversifyExpressServer(container, undefined, {
      rootPath: '/api/v1'
    });
    this.server.setConfig(app => {
      // Add security configuration
      secureApp(app);

      // Add public folder
      app.use(express.static(`${root}/public`));

      // Add response time support
      // This will add x-response-time to the response headers
      app.use(responseTime({ suffix: false }));

      // Add partial response support
      app.use(partialResponse());

      // Add logging configuration
      configLogging(app);

      // Add metrics configuration
      configMetrics(app);

      // Configure Healthchecks
      configHealthChecks(app);

      // Add Compression support
      addCompression(app);

      // Add swagger support
      swaggerify(app);
    });
  }

  public getServer = (): InversifyExpressServer => {
    return this.server;
  };
}
