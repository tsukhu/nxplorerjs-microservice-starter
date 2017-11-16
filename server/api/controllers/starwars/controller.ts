import StarwarsService from '../../services/starwars.service';
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
import IStarwars from '../../interfaces/istarwars';
import IStarwarsController from '../../interfaces/istarwars-controller';

@injectable()
class Controller implements IStarwarsController {

  public starwarsService: IStarwars;
  public loggerService: ILogger;

  public constructor(
    @inject(SERVICE_IDENTIFIER.STARWARS) starwarsService: IStarwars,
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.starwarsService = starwarsService;
    this.loggerService = loggerService;
  }


  public getPeopleById(req: Request, res: Response): void {
    this.starwarsService
      .getPeopleById(req.params.id)
      .timeout(+process.env.TIME_OUT)
      .subscribe(r => {
        if (r === undefined) {
          res.status(HttpStatus.NOT_FOUND).end();
          this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND);
        } else {
          res.status(HttpStatus.OK).json(r);
          this.loggerService.logAPITrace(req, res, HttpStatus.OK);
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
        this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND, error);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
      );
  }

}
export default Controller;
