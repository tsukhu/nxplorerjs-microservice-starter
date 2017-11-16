import './common/env';
import Server from './common/server';
import { Container } from 'inversify';

import * as cluster from 'cluster';


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
  // create server
  const app = new Server();

  app.getServer().build().listen(process.env.PORT);
}
