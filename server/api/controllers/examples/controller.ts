import ExamplesService from '../../services/examples.service';
import { Request, Response } from 'express';
import { Quote } from '../../models/quote.model';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../services/metrics';
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
        res.status(200).json(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, 200);
      },
      error => {
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(500)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(500).json(error);
        AppMetrics.getInstance().logAPIMetrics(req, res, 404);
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
        res.status(200).send(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, 200);
      },
      err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(404)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(404).json(resp);
        AppMetrics.getInstance().logAPIMetrics(req, res , 404);
      }
      );
  }

  public byId(req: Request, res: Response): void {
    ExamplesService
      .byId(req.params.id)
      .then(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, 200);
        } else {
          res.status(404).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, 404);
        }
      },
      error => {
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(404)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(404).json(error);
        AppMetrics.getInstance().logAPIMetrics(req, res , 404);
      });
  }

  public create(req: Request, res: Response): void {
    ExamplesService
      .create(req.body.name)
      .then(r => {
        res.status(201).location(`/api/v1/examples/${r.id}`).end();
        AppMetrics.getInstance().logAPIMetrics(req, res, 201);
      }
      );
  }

}
export default new Controller();
