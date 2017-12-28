import * as express from 'express';
import { Observable } from 'rxjs/Observable';
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

import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';

import ILogger from '../../../common/interfaces/ilogger';
import IMetrics from '../../../common/interfaces/imetrics';
import IProduct from '../../interfaces/iproduct';

import { LogService } from '../../../common/services/log.service';
import { MetricsService } from '../../../common/services/metrics.service';
import { ProductService } from '../../services/product.service';

import { provideSingleton, inject, provide } from '../../../common/config/ioc';
/**
 * Shop API Controller
 */
@Route('shop')
@provideSingleton(ShopController)
export class ShopController extends Controller {
  public productService: IProduct;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(ProductService) productService: IProduct,
    @inject(LogService) loggerService: ILogger,
    @inject(MetricsService) metricsService: IMetrics
  ) {
    super();
    this.productService = productService;
    this.loggerService = loggerService;
    this.metricsService = metricsService;
  }

  /**
   * Get All products
   * @param req
   * @param res
   */
  @Get('products')
  public async allBaseProducts(@Request() req: express.Request): Promise<any> {
    return this.productService.allBaseProducts().subscribe(
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

  /**
   * Get all product options for all products
   * @param req
   * @param res
   */
  @Get('productOptions')
  public async allBaseProductOptions(
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.allBaseProductOptions().subscribe(
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

  /**
   * Get all product pricing per product option
   * @param req
   * @param res
   */
  @Get('prices')
  public async allBaseProductPrice(
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.allBaseProductPrice().subscribe(
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

  /**
   * Get the inventory for each product option per product
   * @param req
   * @param res
   */
  @Get('inventory')
  public async allBaseProductInventory(
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.allBaseProductInventory().subscribe(
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
        return err;
      }
    );
  }

  /**
   * Get Product by ID and then show pricing and inventory for all product options
   * in one reactive RxJS call.
   * @param id
   * @param req
   * @param res
   */
  @Get('/products/{id}')
  public async productbyId(
    id: number,
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.baseProductbyId(id).subscribe(async r => {
      if (r) {
        this.setStatus(HttpStatus.OK);
        this.loggerService.APITrace(req, this, HttpStatus.OK);
        this.metricsService.APIMetrics(req, this, HttpStatus.OK);
        return await r;
      } else {
        this.setStatus(HttpStatus.NOT_FOUND);
        this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
        this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
        return await undefined;
      }
    });
  }

  @Get('/productOptions/{id}')
  public async baseProductOptionsbyId(
    id: number,
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.baseProductOptionsbyId(id).subscribe(async r => {
      if (r) {
        this.setStatus(HttpStatus.OK);
        this.loggerService.APITrace(req, this, HttpStatus.OK);
        this.metricsService.APIMetrics(req, this, HttpStatus.OK);
        return await r;
      } else {
        this.setStatus(HttpStatus.NOT_FOUND);
        this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
        this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
        return await undefined;
      }
    });
  }

  @Get('/prices/{id}')
  public async baseProductPricebyId(
    id: number,
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.baseProductPricebyId(id).subscribe(async r => {
      if (r) {
        this.setStatus(HttpStatus.OK);
        this.loggerService.APITrace(req, this, HttpStatus.OK);
        this.metricsService.APIMetrics(req, this, HttpStatus.OK);
        return await r;
      } else {
        this.setStatus(HttpStatus.NOT_FOUND);
        this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
        this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
        return await undefined;
      }
    });
  }

  /**
   * Check by ID
   */
  @Get('/inventory/{id}')
  public async baseProductInventorybyId(
    id: number,
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService
      .baseProductInventorybyId(id)
      .subscribe(async r => {
        if (r) {
          this.setStatus(HttpStatus.OK);
          this.loggerService.APITrace(req, this, HttpStatus.OK);
          this.metricsService.APIMetrics(req, this, HttpStatus.OK);
          return await r;
        } else {
          this.setStatus(HttpStatus.NOT_FOUND);
          this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
          this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
          return await undefined;
        }
      });
  }

  /**
   * Get Price of product Option using flatMap
   * @param req Request Param
   * @param res Response Param
   */
  @Get('/priceByOptionId/{id}')
  public async flatMapProductOptionPricebyId(
    id: number,
    @Request() req: express.Request
  ): Promise<any> {
    return this.productService.getProductOptionPricebyId(id).subscribe(
      async r => {
        if (r) {
          this.setStatus(HttpStatus.OK);
          this.loggerService.APITrace(req, this, HttpStatus.OK);
          this.metricsService.APIMetrics(req, this, HttpStatus.OK);
          return await r;
        } else {
          this.setStatus(HttpStatus.NOT_FOUND);
          this.loggerService.APITrace(req, this, HttpStatus.NOT_FOUND);
          this.metricsService.APIMetrics(req, this, HttpStatus.NOT_FOUND);
          return await undefined;
        }
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
export default ShopController;
