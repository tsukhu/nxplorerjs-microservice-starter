import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../services/metrics';
import { HttpStatus } from '../../services/http-status-codes';
import * as bunyan from 'bunyan';

const l: bunyan = bunyan.createLogger({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID
});
export class Controller {

  public getPeopleById(req: Request, res: Response): void {
    StarwarsService
      .getPeopleById(req.params.id)
      .timeout(process.env.TIME_OUT)
      .subscribe(r => {
        if (r === undefined) {
          res.status(HttpStatus.NOT_FOUND).end();
        } else {
          res.status(HttpStatus.OK).json(r);
        }
        AppMetrics.getInstance().logAPIMetrics(req, res, req.statusCode);
      },
      err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(HttpStatus.NOT_FOUND)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(HttpStatus.NOT_FOUND).json(resp);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
      );
  }


}
export default new Controller();
