import HystrixService from '../../services/hystrix-demo.service';
import * as express from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { HttpStatus } from '../../services/http-status-codes';
import { inject, injectable } from 'inversify';
import { BlogPost } from '../../models/example.model';
import ILogger from '../../../common/interfaces/ilogger';
import IMetrics from '../../../common/interfaces/imetrics';
import IHystrixDemo from '../../interfaces/ihystrix-demo';
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
import { HystrixDemoService } from '../../services/hystrix-demo.service';

/**
 * Hystrix Demo Controller
 */
@Route('hystrix-demo')
class HystrixController extends Controller {
  public hystrixDemoService: IHystrixDemo;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(HystrixDemoService) hystrixDemoService: IHystrixDemo,
    @inject(LogService) loggerService: ILogger,
    @inject(MetricsService) metricsService: IMetrics
  ) {
    super();
    this.hystrixDemoService = hystrixDemoService;
    this.loggerService = loggerService;
    this.metricsService = metricsService;
  }

  /**
   * Simulate a circuit breaker sequence
   * @param req request
   * @param res response
   */
  @Get('/start')
  public async start(@Request() req: express.Request): Promise<any> {
    return this.hystrixDemoService.start().subscribe(async r => {
      this.setStatus(HttpStatus.OK);
      return await r;
    });
  }

  /**
   * Get Posts from the jsonplaceholder API
   * Pass the timeout as a query parameter
   * Based on the timeout value the circuit breaker will open or close
   * @param req Request
   * @param res Response
   */
  @Get('/start')
  public async posts(@Request() req: express.Request): Promise<any> {
    this.loggerService.info(req.originalUrl);
    return this.hystrixDemoService.getPosts(req.query.timeOut).subscribe(
      async result => {
        this.setStatus(HttpStatus.OK);
        this.loggerService.APITrace(req, this, HttpStatus.OK);
        this.metricsService.APIMetrics(req, this, HttpStatus.OK);
        return await result;
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
        return await err;
      }
    );
  }
}
export default HystrixController;
