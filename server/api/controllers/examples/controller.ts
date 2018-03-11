import ExamplesService from '../../services/examples.service';
import { Request, Response } from 'express';
import { Quote } from '../../models/quote.model';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { HttpStatus } from '../../services/http-status-codes';
import {
  interfaces,
  controller,
  BaseHttpController,
  httpGet,
  httpPost,
  httpDelete,
  request,
  queryParam,
  response,
  requestParam
} from 'inversify-express-utils';
import container from '../../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';
import { inject, injectable } from 'inversify';

import ILogger from '../../../common/interfaces/ilogger';
import IMetrics from '../../../common/interfaces/imetrics';
import IExample from '../../interfaces/iexample';
import { authMiddleware } from '../../../common/middleware/auth-middleware';
import { User } from '../../../common/models/security.model';

/**
 * Examples Controller
 * JWT Auth middleware as well as logging middleware added
 */
@controller(
  '/examples',
  authMiddleware(<User>{ role: 'admin' }),
  SERVICE_IDENTIFIER.LOGGER_MIDDLEWARE
)
class ExampleController extends BaseHttpController {
  public exampleService: IExample;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(SERVICE_IDENTIFIER.EXAMPLE) exampleService: IExample,
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger,
    @inject(SERVICE_IDENTIFIER.METRICS) metricsService: IMetrics
  ) {
    super();
    this.exampleService = exampleService;
    this.loggerService = loggerService;
    this.metricsService = metricsService;
  }

  /**
   * Get all items in the examples collection
   * @param req request
   * @param res response
   */
  @httpGet('/')
  public async all(@request() req: Request, @response() res: Response) {
    return await this.exampleService.all();
  }

  /**
   * Get Posts by ID
   * @param id post ID
   * @param req request
   * @param res response
   */
  @httpGet('/:id')
  public async byPostsByID(
    @requestParam('id') id: number,
    @request() req: Request,
    @response() res: Response
  ) {
    this.loggerService.info(req.originalUrl);
    return await new Promise((resolve, reject) => {
      this.exampleService
        .byPostsByID(id)
        .timeout(+process.env.API_TIME_OUT)
        .subscribe(
          result => {
            this.loggerService.info(<Quote>result.data);
            this.loggerService.info(result.timings);
            this.loggerService.logAPITrace(req, res, HttpStatus.OK);
            this.metricsService.logAPIMetrics(req, res, HttpStatus.OK);
            resolve(result.data);
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
            this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND);
            this.metricsService.logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
            reject(resp);
          }
        );
    });
  }

  /**
   * Check by ID
   * @param req request
   * @param res response
   */
  public byId(req: Request, res: Response): void {
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
  @httpPost('/')
  public async create(@request() req: Request, @response() res: Response) {
    return await this.exampleService.create(req.body.name);
  }
}
export default ExampleController;
