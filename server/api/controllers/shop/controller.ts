import ProductService from '../../services/product.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { AppMetrics } from '../../services/metrics';
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
        res.status(200).json(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, 200);
      },
      err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(404)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(404).json(resp);
        AppMetrics.getInstance().logAPIMetrics(req, res, 404);
      }
      );
  }

  public allBaseProductOptions(req: Request, res: Response): void {
    ProductService
      .allBaseProductOptions()
      .subscribe(
      result => {
        res.status(200).json(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, 200);
      },
      err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(404)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(404).json(resp);
        AppMetrics.getInstance().logAPIMetrics(req, res, 404);
      }
      );
  }

  public allBaseProductPrice(req: Request, res: Response): void {
    ProductService
      .allBaseProductPrice()
      .subscribe(
      result => {
        res.status(200).json(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, 200);
      },
      err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(404)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(404).json(resp);
        AppMetrics.getInstance().logAPIMetrics(req, res, 404);
      }
      );
  }

  public allBaseProductInventory(req: Request, res: Response): void {
    ProductService
      .allBaseProductInventory()
      .subscribe(
      result => {
        res.status(200).json(result);
        AppMetrics.getInstance().logAPIMetrics(req, res, 200);
      },
      err => {
        const error: HttpError = <HttpError>err;
        const resp = new ErrorResponseBuilder()
          .setTitle(error.name)
          .setStatus(404)
          .setDetail(error.stack)
          .setMessage(error.message)
          .setSource(req.url)
          .build();
        res.status(404).json(resp);
        AppMetrics.getInstance().logAPIMetrics(req, res, 404);
      }
      );
  }

  public productbyId(req: Request, res: Response): void {
    ProductService
      .baseProductbyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, 200);
        } else {
          res.status(404).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, 404);
        }
      });
  }

  public baseProductOptionsbyId(req: Request, res: Response): void {
    ProductService
      .baseProductOptionsbyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, 200);
        } else {
          res.status(404).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, 404);
        }
      });
  }

  public baseProductPricebyId(req: Request, res: Response): void {
    ProductService
      .baseProductPricebyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, 200);
        } else {
          res.status(404).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, 404);
        }
      });
  }

  public baseProductInventorybyId(req: Request, res: Response): void {
    ProductService
      .baseProductInventorybyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
          AppMetrics.getInstance().logAPIMetrics(req, res, 200);
        } else {
          res.status(404).end();
          AppMetrics.getInstance().logAPIMetrics(req, res, 404);
        }
      });
  }


}
export default new Controller();
