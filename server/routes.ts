import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router';
import shopRouter from './api/controllers/shop/router';
import starWarsRouter from './api/controllers/starwars/router';
import hystrixDemoRouter from './api/controllers/hystrix-demo/router';
// import graphQlRouter from './graphql/router';
export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/shop', shopRouter);
  app.use('/api/v1/starwars', starWarsRouter);
  app.use('/api/v1/hystrix-demo', hystrixDemoRouter);
//  app.use('/', graphQlRouter);
}
