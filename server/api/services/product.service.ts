import * as Promise from 'bluebird';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import * as _ from 'lodash';
import {
    BaseProduct,
    BaseProductPrice,
    BaseProductInventory,
    BaseProductOption
} from '../models/product.model';
import { Planet, People } from '../models/starwars.model';
const rp: any = require('request-promise');

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
const baseProductOptions1: BaseProductOption[] = [
    {
        baseProductOptionId: bpoId++,
        description: 'Base product option 0'
    },
    {
        baseProductOptionId: bpoId++,
        description: 'Base product option 1'
    },
    {
        baseProductOptionId: bpoId++,
        description: 'Base product option 2'
    }];
const baseProductOptions2: BaseProductOption[] = [
    {
        baseProductOptionId: bpoId++,
        description: 'Base product option 3'
    },
    {
        baseProductOptionId: bpoId++,
        description: 'Base product option 4'
    },
    {
        baseProductOptionId: bpoId,
        description: 'Base product option 5'
    }
];

const baseProductOptions: BaseProductOption[] = Array.prototype.concat(baseProductOptions1, baseProductOptions2);


const baseProducts: BaseProduct[] = [
    {
        id: bpId++, name: 'product 0', description: 'product 0',
        baseProductOptions: baseProductOptions1
    },
    {
        id: bpId++, name: 'product 1', description: 'product 1',
        baseProductOptions: baseProductOptions2
    }
];

export class ProductService {
    public allBaseProducts(): Observable<BaseProduct[]> {
        return Observable.from(baseProducts).toArray();
    }

    public baseProductbyId(id: number): Observable<BaseProduct> {

        const results: BaseProduct[] = _.filter(baseProducts, product => {
            // tslint:disable-next-line:triple-equals
            return product.id == id;
        });
        return Observable.of(results[0]);
    }

    public allBaseProductOptions(): Observable<BaseProductOption[]> {
        return Observable.from(baseProductOptions).toArray();
    }

    public baseProductOptionsbyId(id: number): Observable<BaseProductOption> {
        const results = _.filter(baseProductOptions, options => {
            // tslint:disable-next-line:triple-equals
            return options.baseProductOptionId == id;
        });
        return Observable.from(_.take(results, 1));
    }

    public allBaseProductPrice(): Observable<BaseProductPrice[]> {
        return Observable.from(baseProductPrice).toArray();
    }

    public baseProductPricebyId(id: number): Observable<BaseProductPrice> {
        const results: BaseProductPrice[] = _.filter(baseProductPrice, price => {
            // tslint:disable-next-line:triple-equals
            return price.baseProductOptionId == id;
        });
        return Observable.of(results[0]);
    }

    public allBaseProductInventory(): Observable<BaseProductInventory[]> {
        return Observable.from(baseProductInventory).toArray();
    }

    public baseProductInventorybyId(id: number): Observable<BaseProductInventory> {
        const results = _.filter(baseProductInventory, inv => {
            // tslint:disable-next-line:triple-equals
            return inv.baseProductOptionId == id;
        });
        return Observable.from(_.take(results, 1));
    }
}


export default new ProductService();
