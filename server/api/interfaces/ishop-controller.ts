import { Request, Response } from 'express';

interface IShopController {

  allBaseProducts(req: Request, res: Response): void;

  allBaseProductOptions(req: Request, res: Response): void;

  allBaseProductPrice(req: Request, res: Response): void;

  allBaseProductInventory(req: Request, res: Response): void;

  productbyId(req: Request, res: Response): void;

  baseProductOptionsbyId(req: Request, res: Response): void;

  baseProductPricebyId(req: Request, res: Response): void;

  baseProductInventorybyId(req: Request, res: Response): void;

  flatMapProductOptionPricebyId(req: Request, res: Response): void;

}

export default IShopController;
