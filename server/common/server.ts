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
import * as Brakes from 'brakes';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../graphql/schema';

const LOG = LogManager.getInstance();

const responseTime = require('response-time');


// tslint:disable-next-line:typedef
const app = express();


// Init
const Prometheus = require('prom-client');

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });

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
    app.use(cookieParser(process.env.SESSION_SECRET));
 //   app.use(logger(bunyanOpts));
    app.use(bodyParser.urlencoded({ extended: true }));

    if (process.env.NODE_ENV === 'production') {
      app.use(csrf({ cookie: true }));
    }
    app.use(express.static(`${root}/public`));
    app.use(responseTime({ suffix: false }));
    app.use(partialResponse());
    app.use((req: any, res, next) => {
      // write the csrf cookie in the response in the ‘XSRF-TOKEN’ field
      // The client must pass 'x-xsrf-token' or 'x-csrf-token'
      // or 'xsrf-token' or 'csrf-token' in the header with the value set
      if (process.env.NODE_ENV === 'production') {
        res.cookie('XSRF-TOKEN', req.csrfToken());
      }
      LogManager.getInstance().setUUID(req.cookies['UUID']);
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
  }

  public router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  public listen(port: string = process.env.PORT): Application {
    // tslint:disable
    const welcome = (port) => console.log(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}`);
    const ws = http.createServer(app)
    ws.listen(port, () => {
     welcome(port);
    }
    );

    const subscriptionServer = new SubscriptionServer({
      execute,
      subscribe,
      schema: myGraphQLSchema
    }, {
        server: ws,
        path: '/subscriptions',
      });

    if (process.env.STREAM_HYSTRIX === 'true') {
      const globalStats = Brakes.getGlobalStats();
      http.createServer((req, res) => {
        res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        globalStats.getHystrixStream().pipe(res);
      }).listen(3001, () => {
        console.log('---------------------');
        console.log('Hystrix Stream now live at localhost:3001/hystrix.stream');
        console.log('---------------------');
      });
    }

    return app;
  }
  // tslint:disable-next-line:eofline
}