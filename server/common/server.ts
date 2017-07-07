import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import { LogManager } from './log-manager';


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
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    app.use(responseTime({suffix : false}));
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

  public listen(port: number = process.env.PORT): Application {
    // tslint:disable
    const welcome = port => () => LOG.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
  // tslint:disable-next-line:eofline
}