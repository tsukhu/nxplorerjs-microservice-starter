import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import * as bunyan from 'bunyan';

const Prometheus = require('prom-client');
const httpRequestDurationMicroseconds = new Prometheus.Summary({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});


const l: bunyan = bunyan.createLogger({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID
});
export class Controller {

  public getPeopleById(req: Request, res: Response): void {
    StarwarsService
      .getPeopleById(req.params.id)
      .subscribe(r => {
        if (r === undefined) {
          res.status(404).end();
        } else {
          res.status(200).json(r);
        }
        // After each response
    //    res.getHeader('x-response-time');
        httpRequestDurationMicroseconds
          .labels(req.route.path)
          .observe(res.getHeader('x-response-time'));
      },
      err => {
        res.status(404).json(err);
      });
  }


}
export default new Controller();
