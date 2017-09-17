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
import swaggerify from './swagger';
import { LogManager } from './log-manager';

import * as bunyan from 'bunyan';

import * as logger from 'express-bunyan-logger';

const bunyanOpts = {
  name: 'myapp',
  streams: [
    {
      level: process.env.LOG_LEVEL,
      stream: process.stdout,       // log INFO and above to stdout
      type: 'stream'
    },
    {
      path: process.env.LOG_DIRECTORY + 'server.log',  // log ERROR and above to a file
      type: 'rotating-file',
      period: '1d',   // daily rotation
      count: 3        // keep 3 back copies
    }
  ]
  /* Uncomment this for custom UUID
  ,
  genReqId: (req) => {
    return req.headers['x-request-id'];
  }*/
};


const LOG = LogManager.getInstance().getLogger();

const responseTime = require('response-time');


// tslint:disable-next-line:typedef
const app = express();


// Init
const Prometheus = require('prom-client');

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics(5000);

export default class ExpressServer {
  constructor() {
    let root: string;
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      root = path.normalize(__dirname + '/../..');
    }
    else {
      root = path.normalize('.');
    }
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(logger(bunyanOpts));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
  //  app.use(csrf({ cookie: true }));
    app.use(express.static(`${root}/public`));
    app.use(responseTime({ suffix: false }));
    app.use(partialResponse());
    app.use((req: any, res, next) => {
      // Set using X-Request-Id or generated automatically
      console.log(req.log.fields.req_id);
      LogManager.getInstance().setUUID(req.log.fields.req_id);
      next();
    });
    // Metrics endpoint
    app.get('/metrics', (req, res) => {
      res.set('Content-Type', Prometheus.register.contentType);
      res.end(Prometheus.register.metrics());
    });
  }

  public router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  public listen(port: string = process.env.PORT): Application {
    // tslint:disable
    const welcome = port => () => LOG.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
  // tslint:disable-next-line:eofline
}