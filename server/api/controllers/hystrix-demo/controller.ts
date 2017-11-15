import HystrixService from '../../services/hystrix-demo.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../../common/metrics';
import { HttpStatus } from '../../services/http-status-codes';
import container from '../../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';
import { inject, injectable } from 'inversify';

import ILogger from '../../../common/interfaces/ilogger';

const LOG = container.get<ILogger>(SERVICE_IDENTIFIER.LOGGER);

export class Controller {

  public start(req: Request, res: Response): void {
    HystrixService.start()
      .subscribe(
      r => {
        res.status(HttpStatus.OK).json(r);
      }
      );
  }

  public posts(req: Request, res: Response): void {
    LOG.info(req.originalUrl);
    HystrixService
      .getPosts(req.query.timeOut)
      .subscribe(
      result => {
       // LOG.info(result);
        res.status(HttpStatus.OK).send(result);
        LOG.logAPITrace(req, res, HttpStatus.OK);
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
        LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
      );
  }
}
export default new Controller();
