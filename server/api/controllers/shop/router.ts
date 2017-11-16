import * as express from 'express';
import container from '../../../common/config/ioc_config';
import IShopController from '../../interfaces/ishop-controller';

import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';

const controller = container.get<IShopController>(SERVICE_IDENTIFIER.SHOP_CONTROLLER);
export default express.Router()
    .get('/products', controller.allBaseProducts)
    .get('/products/:id', controller.productbyId)
    .get('/productOptions', controller.allBaseProductOptions)
    .get('/productOptions/:id', controller.baseProductOptionsbyId)
    .get('/prices', controller.allBaseProductPrice)
    .get('/prices/:id', controller.baseProductPricebyId)
    .get('/inventory', controller.allBaseProductInventory)
    .get('/inventory/:id', controller.baseProductInventorybyId)
    .get('/priceByOptionId/:id', controller.flatMapProductOptionPricebyId);
