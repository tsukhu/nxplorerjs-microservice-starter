import * as Promise from 'bluebird';
import { Observable } from 'rxjs';
import { BaseProduct, BaseProductPrice, BaseProductInventory, BaseProductOption } from '../models/product.model';


const rxHttp: any = require('node-rx-http');

let bpId = 0;
let bpoId = 0;
let invId = 0;
let basePrice = 100.0;
let baseInventory = 1;
let prId = 0;

const baseProductPrice: BaseProductPrice[] = [
    {
        id: prId++,
        baseProductOptionId: bpoId++,
        price: basePrice++
    },
    {
        id: prId++,
        baseProductOptionId: bpoId++,
        price: basePrice++
    },
    {
        id: prId++,
        baseProductOptionId: bpoId++,
        price: basePrice++
    }
];

bpoId = 0;

const baseProductInventory: BaseProductInventory[] = [

    {
        id: invId++,
        baseProductOptionId: bpoId++,
        inventory: baseInventory++
    },
    {
        id: invId++,
        baseProductOptionId: bpoId++,
        inventory: baseInventory++
    },
    {
        id: invId++,
        baseProductOptionId: bpoId++,
        inventory: baseInventory++
    }

];

bpoId = 0;
const baseProductOptions: BaseProductOption[] = [
    {
        optionId: bpoId,
        description: 'Base product option 0'
    },
    {
        optionId: bpoId,
        description: 'Base product option 1'
    },
    {
        optionId: bpoId++,
        description: 'Base product option 2'
    },
    {
        optionId: bpoId,
        description: 'Base product option 3'
    },
    {
        optionId: bpoId,
        description: 'Base product option 4'
    },
    {
        optionId: bpoId,
        description: 'Base product option 5'
    }
];

const baseProducts: BaseProduct[] = [
    {
        id: bpId++, name: 'product 0', description: 'product 0',
        baseProductOptions: baseProductOptions
    },
    {
        id: bpId++, name: 'product 1', description: 'product 1',
        baseProductOptions: baseProductOptions
    },
    {
        id: bpId++, name: 'product 2', description: 'product 2',
        baseProductOptions: baseProductOptions
    }
];

export class ProductService {
    public allBaseProducts(): Promise<BaseProduct[]> {
        return Promise.resolve(baseProducts);
    }

    public baseProductbyId(id: number): Promise<BaseProduct> {
        return this.allBaseProducts().then(r => r[id]);
    }

    public allBaseProductOptions(): Promise<BaseProductOption[]> {
        return Promise.resolve(baseProductOptions);
    }

    public baseProductOptionsbyId(id: number): Promise<BaseProductOption[]> {
        return this.allBaseProductOptions().then(r => r[id]);
    }

    public allBaseProductPrice(): Promise<BaseProductPrice[]> {
        return Promise.resolve(baseProductPrice);
    }

    public baseProductPricebyId(id: number): Promise<BaseProductPrice> {
        return this.allBaseProductPrice().then(r => r[id]);
    }

    public allBaseProductInventory(): Promise<BaseProductInventory[]> {
        return Promise.resolve(baseProductInventory);
    }

    public baseProductInventorybyId(id: number): Promise<BaseProductInventory> {
        return this.allBaseProductInventory().then(r => r[id]);
    }
}

export default new ProductService();
