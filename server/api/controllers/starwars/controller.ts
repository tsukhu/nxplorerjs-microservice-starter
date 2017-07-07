import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../../common/metrics';
import { HttpStatus } from '../../services/http-status-codes';
import { LogManager } from '../../../common/log-manager';


const LOG = LogManager.getInstance().getLogger();

export class Controller {

  public getPeopleById(req: Request, res: Response): void {
    StarwarsService
      .getPeopleById(req.params.id)
      .timeout(process.env.TIME_OUT)
      .subscribe(r => {
        if (r === undefined) {
          res.status(HttpStatus.NOT_FOUND).end();
          LogManager.getInstance().logAPITrace(req, res, HttpStatus.NOT_FOUND);
        } else {
          res.status(HttpStatus.OK).json(r);
          LogManager.getInstance().logAPITrace(req, res, HttpStatus.OK);
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
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.NOT_FOUND, error);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
      );
  }


}
export default new Controller();
