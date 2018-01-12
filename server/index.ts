import './common/env';
import Server from './common/server';
import { Container } from 'inversify';
import { configHystrix } from '../server/common/config/hystrix';
import { configGraphQLSubscription } from '../server/common/config/graphql-subscription';
import * as cluster from 'cluster';
import * as os from 'os';

// Run in cluster mode
if (process.env.CLUSTER_MODE === 'true' && cluster.isMaster) {
  const numWorkers = require('os').cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'Worker ' +
        worker.process.pid +
        ' died with code: ' +
        code +
        ', and signal: ' +
        signal
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  // Single Node execution
  const welcome = port =>
    console.log(
      `up and running in ${process.env.NODE_ENV ||
        'development'} @: ${os.hostname()} on port: ${port}`
    );

  // create server
  const app = new Server().getServer().build();

  // configure Subscription
  configGraphQLSubscription(app, welcome);

  // configure Hystrix Support
  configHystrix();
}
