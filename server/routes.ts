import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router';
import shopRouter from './api/controllers/shop/router';
export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/shop', shopRouter);
}
