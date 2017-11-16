import './common/env';
import Server from './common/server';
import { Container } from 'inversify';
import * as http from 'http';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import myGraphQLSchema from './graphql/schema';
import * as cluster from 'cluster';
import * as Brakes from 'brakes';
import * as os from 'os';

if (process.env.CLUSTER_MODE === 'true' && cluster.isMaster) {
  const numWorkers = require('os').cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const welcome = (port) => console.log(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}`);

  // create server
  const app = new Server().getServer().build();

  const ws = http.createServer(app);
  ws.listen(process.env.PORT, () => {
    welcome(process.env.PORT);
  });

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
}
