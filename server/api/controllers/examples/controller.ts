import ExamplesService from '../../services/examples.service';
import { Request, Response } from 'express';
import { Quote } from '../../models/quote.model';
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
  public all(req: Request, res: Response): void {
    ExamplesService
      .all()
      .then(
      result => {
        res.status(HttpStatus.OK).json(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
      },
      error => {
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(HttpStatus.INTERNAL_SERVER_ERROR)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
      );
  }

  public byPostsByID(req: Request, res: Response): void {
    l.info(req.originalUrl);
    ExamplesService
      .byPostsByID(req.params.id)
      .timeout(7000)
      .subscribe(
      result => {
        l.info(<Quote>result);
        res.status(HttpStatus.OK).send(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
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
        AppMetrics.getInstance().logAPIMetrics(req, res , HttpStatus.NOT_FOUND);
      }
      );
  }

  public byId(req: Request, res: Response): void {
    ExamplesService
      .byId(req.params.id)
      .then(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      },
      error => {
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(HttpStatus.NOT_FOUND)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(HttpStatus.NOT_FOUND).json(error);
        AppMetrics.getInstance().logAPIMetrics(req, res , HttpStatus.NOT_FOUND);
      });
  }

  public create(req: Request, res: Response): void {
    ExamplesService
      .create(req.body.name)
      .then(r => {
        res.status(HttpStatus.CREATED).location(`/api/v1/examples/${r.id}`).end();
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.CREATED);
      }
      );
  }

}
export default new Controller();
