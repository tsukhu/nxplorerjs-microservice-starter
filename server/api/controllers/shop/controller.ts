import ProductService from '../../services/product.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../services/metrics';
import { HttpStatus } from 'http-status-codes';
import * as bunyan from 'bunyan';

const l: bunyan = bunyan.createLogger({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID
});

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
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
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
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
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
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      });
  }

  public baseProductInventorybyId(req: Request, res: Response): void {
    ProductService
      .baseProductInventorybyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.OK);
        } else {
          res.status(HttpStatus.NOT_FOUND).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
        }
      });
  }


}
export default new Controller();
