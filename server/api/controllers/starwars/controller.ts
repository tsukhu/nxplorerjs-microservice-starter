import StarwarsService from '../../services/starwars.service';
import * as express from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { Planet, People } from '../../models/starwars.model';
import { HttpStatus } from '../../services/http-status-codes';
import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';
import ILogger from '../../../common/interfaces/ilogger';
import IMetrics from '../../../common/interfaces/imetrics';
import IStarwars from '../../interfaces/istarwars';
import {
  Get,
  Post,
  Route,
  Request,
  Body,
  Query,
  Header,
  Path,
  SuccessResponse,
  Controller
} from 'tsoa';

import { LogService } from '../../../common/services/log.service';
import { MetricsService } from '../../../common/services/metrics.service';


import { provideSingleton, inject, provide } from '../../../common/config/ioc';
/**
 * Controller for StarWars APIs
 */
@Route('starwars')
@provideSingleton(StarwarsController)
export class StarwarsController extends Controller {

  public starwarsService: IStarwars;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(StarwarsService) starwarsService: IStarwars,
    @inject(LogService) loggerService: ILogger,
    @inject(MetricsService) metricsService: IMetrics
  ) {
    super();
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
  @Get('/people/{id}')
  public async getPeopleById(id: number, @Request() req: express.Request): Promise<any> {
    return this.starwarsService
      .getPeopleById(id)
      .timeout(+process.env.TIME_OUT)
      .subscribe(async r => {
        if (r === undefined) {
          this.setStatus(HttpStatus.NOT_FOUND);
          this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
        } else {
          this.setStatus(HttpStatus.OK);
          this.loggerService.APITrace(req, this, HttpStatus.OK);
        }
        this.metricsService.APIMetrics(req, this, req.statusCode);
        return await r;
      },
      async err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(HttpStatus.NOT_FOUND)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        this.setStatus(HttpStatus.NOT_FOUND);
        this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
        this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
        return await error;
      }
      );
  }

}
export default StarwarsController;
