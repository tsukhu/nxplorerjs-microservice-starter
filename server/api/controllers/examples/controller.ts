import ExamplesService from '../../services/examples.service';
import { Request, Response } from 'express';
import { Quote } from '../../models/quote.model';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../../common/metrics';
import { HttpStatus } from '../../services/http-status-codes';
import { LogManager } from '../../../common/log-manager';


const LOG = LogManager.getInstance().getLogger();

export class Controller {
  public all(req: Request, res: Response): void {
    ExamplesService
      .all()
      .then(
      result => {
        res.status(HttpStatus.OK).json(result);
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.OK);
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
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.NOT_FOUND);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
      );
  }

  public byPostsByID(req: Request, res: Response): void {
    LOG.info(req.originalUrl);
    ExamplesService
      .byPostsByID(req.params.id)
      .timeout(+process.env.TIME_OUT)
      .subscribe(
      result => {
        LOG.info(<Quote>result);
        res.status(HttpStatus.OK).send(result);
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.OK);
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
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.NOT_FOUND);
        AppMetrics.getInstance().logAPIMetrics(req, res , HttpStatus.NOT_FOUND);
      }
      );
  }

  /**
   * Check by ID
   */
  public byId(req: Request, res: Response): void {
    ExamplesService
      .byId(req.params.id)
      .then(r => {
        if (r) {
          res.json(r);
          LogManager.getInstance().logAPITrace(req, res, HttpStatus.OK);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          LogManager.getInstance().logAPITrace(req, res, HttpStatus.NOT_FOUND);
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
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.NOT_FOUND);
        AppMetrics.getInstance().logAPIMetrics(req, res , HttpStatus.NOT_FOUND);
      });
  }

  /**
   * Create request sample
   * Add a new element to the in memory Sample object
   */
  public create(req: Request, res: Response): void {
    ExamplesService
      .create(req.body.name)
      .then(r => {
        res.status(HttpStatus.CREATED).location(`/api/v1/examples/${r.id}`).json(r).end();
        LogManager.getInstance().logAPITrace(req, res, HttpStatus.CREATED);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.CREATED);
      }
      );
  }

}
export default new Controller();
