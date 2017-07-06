import * as express from 'express';
import controller from './controller';
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
