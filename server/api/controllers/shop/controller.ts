import ProductService from '../../services/product.service';
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

/**
 * Shop API Controller
 */
export class Controller {
  public allBaseProducts(req: Request, res: Response): void {
    ProductService
      .allBaseProducts()
      .subscribe(
      result => {
        res.status(HttpStatus.OK).json(result);
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

  public allBaseProductOptions(req: Request, res: Response): void {
    ProductService
      .allBaseProductOptions()
      .subscribe(
      result => {
        res.status(HttpStatus.OK).json(result);
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

  public allBaseProductPrice(req: Request, res: Response): void {
    ProductService
      .allBaseProductPrice()
      .subscribe(
      result => {
        res.status(HttpStatus.OK).json(result);
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

  public allBaseProductInventory(req: Request, res: Response): void {
    ProductService
      .allBaseProductInventory()
      .subscribe(
      result => {
        res.status(HttpStatus.OK).json(result);
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

  public productbyId(req: Request, res: Response): void {
    ProductService
      .baseProductbyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          LOG.logAPITrace(req, res, HttpStatus.OK);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      });
  }

  public baseProductOptionsbyId(req: Request, res: Response): void {
    ProductService
      .baseProductOptionsbyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          LOG.logAPITrace(req, res, HttpStatus.OK);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      });
  }

  public baseProductPricebyId(req: Request, res: Response): void {
    ProductService
      .baseProductPricebyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          LOG.logAPITrace(req, res, HttpStatus.OK);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      });
  }

/**
 * Check by ID
 */
  public baseProductInventorybyId(req: Request, res: Response): void {
    ProductService
      .baseProductInventorybyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          LOG.logAPITrace(req, res, HttpStatus.OK);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      });
  }

  /**
   * Get Price of product Option using flatMap
   * @param req Request Param
   * @param res Response Param
   */
  public flatMapProductOptionPricebyId(req: Request, res: Response): void {
     ProductService
      .getProductOptionPricebyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
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
        res.status(HttpStatus.NOT_FOUND).json(resp);
        LOG.logAPITrace(req, res, HttpStatus.NOT_FOUND);
        AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
      });
  }

}
export default new Controller();
