import * as express from 'express';
import { Quote } from '../../models/quote.model';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { HttpStatus } from '../../services/http-status-codes';
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
import { provideSingleton, inject,provide } from '../../../common/config/ioc';

import { LogService } from '../../../common/services/log.service';
import { MetricsService } from '../../../common/services/metrics.service';
import { ExamplesService } from '../../services/examples.service';
import ILogger from '../../../common/interfaces/ilogger';
import IMetrics from '../../../common/interfaces/imetrics';
import IExample from '../../interfaces/iexample';
import { Example } from '../../models/example.model';
import "reflect-metadata";

/**
 * Examples Controller
 */
@Route('examples')
@provideSingleton(ExampleController)
class ExampleController extends Controller {
  public exampleService: IExample;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(ExamplesService) exampleService: IExample,
    @inject(LogService) loggerService: ILogger,
    @inject(MetricsService) metricsService: IMetrics
  ) {
    super();
    this.exampleService = exampleService;
    this.loggerService = loggerService;
    this.metricsService = metricsService;
  }

  /**
   * Get all items in the examples collection
   */
  @Get('/')
  public async all(@Request() req: express.Request): Promise<Example[]> {
    this.loggerService.info('Hello');
    return this.exampleService.all().then(
      async result => {
        this.setStatus(HttpStatus.OK);
        this.loggerService.APITrace(req, this, HttpStatus.OK);
        this.metricsService.APIMetrics(req, this, HttpStatus.OK);
        return await result;
      },
      async error => {
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(HttpStatus.INTERNAL_SERVER_ERROR)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        let examples: Example[];
        this.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
        this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
        return await examples;
      }
    );
  }

  /**
   * Get Posts by ID
   * @param id post ID
   * @param req request
   * @param res response
   */
  @Get('{id}')
  public async byPostsByID(
    id: number,
    @Request() req: express.Request
  ): Promise<any> {
    this.loggerService.info(req.originalUrl);
    return this.exampleService
      .byPostsByID(id)
      .timeout(+process.env.TIME_OUT)
      .subscribe(
        async result => {
          this.loggerService.info(<Quote>result.data);
          this.loggerService.info(result.timings);
          this.setStatus(HttpStatus.OK);
          this.loggerService.APITrace(req, this, HttpStatus.OK);
          this.metricsService.APIMetrics(req, this, HttpStatus.OK);
          return await result.data;
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

  /**
   * Check by ID
   * @param req request
   * @param res response
   */
  public byId(req: express.Request, res: express.Response): void {
    this.exampleService.byId(req.params.id).then(
      r => {
        if (r) {
          res.json(r);
          this.loggerService.logAPITrace(req, res, HttpStatus.OK);
          this.metricsService.logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          this.metricsService.logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
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
        this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND);
        this.metricsService.logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      }
    );
  }

  /**
   * Create request sample
   * Add a new element to the in memory Sample object
   * @param req request
   * @param res response
   */
  @Post('/')
  public async create(@Request() req: express.Request): Promise<Example> {
    return this.exampleService.create(req.body.name).then(async r => {
      this.setStatus(HttpStatus.CREATED);
      this.loggerService.APITrace(req, this, HttpStatus.CREATED);
      this.metricsService.APIMetrics(req, this, HttpStatus.CREATED);
      return await r;
    });
  }
}
export default ExampleController;
