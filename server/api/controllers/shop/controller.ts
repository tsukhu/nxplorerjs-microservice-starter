import ProductService from '../../services/product.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import * as bunyan from 'bunyan';

const l: bunyan = bunyan.createLogger({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID
});
export class Controller {
  public allBaseProducts(req: Request, res: Response): void {
    ProductService
      .allBaseProducts()
      .subscribe(
      result => res.status(200).json(result),
      error => res.status(500).json(error)
      );
  }

  public allBaseProductOptions(req: Request, res: Response): void {
    ProductService
      .allBaseProductOptions()
      .subscribe(
      result => res.status(200).json(result),
      error => res.status(500).json(error)
      );
  }

  public allBaseProductPrice(req: Request, res: Response): void {
    ProductService
      .allBaseProductPrice()
      .subscribe(
      result => res.status(200).json(result),
      error => res.status(500).json(error)
      );
  }

  public allBaseProductInventory(req: Request, res: Response): void {
    ProductService
      .allBaseProductInventory()
      .subscribe(
      result => res.status(200).json(result),
      error => res.status(500).json(error)
      );
  }

  public productbyId(req: Request, res: Response): void {
    ProductService
      .baseProductbyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
        } else {
          res.status(404).end();
        }
      });
  }

  public baseProductOptionsbyId(req: Request, res: Response): void {
    ProductService
      .baseProductOptionsbyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
        } else {
          res.status(404).end();
        }
      });
  }

  public baseProductPricebyId(req: Request, res: Response): void {
    ProductService
      .baseProductPricebyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
        } else {
          res.status(404).end();
        }
      });
  }

  public baseProductInventorybyId(req: Request, res: Response): void {
    ProductService
      .baseProductInventorybyId(req.params.id)
      .subscribe(r => {
        if (r) {
          res.json(r);
        } else {
          res.status(404).end();
        }
      });
  }


}
export default new Controller();
