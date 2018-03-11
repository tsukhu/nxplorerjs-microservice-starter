import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { HttpStatus } from '../../services/http-status-codes';
import container from '../../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';
import { inject, injectable } from 'inversify';
import { APIResponse } from '../../models/api-response.model';
import ILogger from '../../../common/interfaces/ilogger';
import IMetrics from '../../../common/interfaces/imetrics';
import IStarwars from '../../interfaces/istarwars';

import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpDelete,
  request,
  queryParam,
  response,
  requestParam
} from 'inversify-express-utils';

/**
 * Controller for StarWars APIs
 */
@controller('/starwars')
class StarwarsController implements interfaces.Controller {
  public starwarsService: IStarwars;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(SERVICE_IDENTIFIER.STARWARS) starwarsService: IStarwars,
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger,
    @inject(SERVICE_IDENTIFIER.METRICS) metricsService: IMetrics
  ) {
    this.starwarsService = starwarsService;
    this.loggerService = loggerService;
    this.metricsService = metricsService;
  }

  /**
   * Get Starwars Actors by ID
   * @param id Actor ID
   * @param req Request
   * @param res Response
   */
  @httpGet('/people/:id')
  public async getPeopleById(
    @requestParam('id') id: number,
    @request() req: Request,
    @response() res: Response
  ) {
      const result: APIResponse = await new Promise((resolve, reject) => {
        this.starwarsService
          .getPeopleById(id)
          .timeout(+process.env.API_TIME_OUT)
          .subscribe(
            r => {
              if (r === undefined) {
                this.loggerService.logAPITrace(
                  req,
                  res,
                  HttpStatus.INTERNAL_SERVER_ERROR
                );
                this.metricsService.logAPIMetrics(
                  req,
                  res,
                  HttpStatus.INTERNAL_SERVER_ERROR
                );
                reject({ data: r, status: HttpStatus.INTERNAL_SERVER_ERROR });
              } else {
                this.loggerService.logAPITrace(req, res, HttpStatus.OK);
                this.metricsService.logAPIMetrics(req, res, HttpStatus.OK);
                resolve({ data: r, status: HttpStatus.OK });
              }
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
              this.loggerService.logAPITrace(
                req,
                res,
                HttpStatus.NOT_FOUND,
                error
              );
              this.metricsService.logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
              reject({ errors: [resp], status: HttpStatus.NOT_FOUND });
            }
          );
      });
      res.status(result.status).json(result);
  }
}
export default StarwarsController;
