import 'reflect-metadata';

import { Container } from 'inversify';

import LogService from '../services/log-service';
import ExamplesService from '../../api/services/examples.service';
import ExampleController from '../../api/controllers/examples/controller';
import IExample from '../../api/interfaces/iexample';
import IHystrixDemo from '../../api/interfaces/ihystrix-demo';
import ProductService from '../../api/services/product.service';
import IStarwarsService from '../../api/interfaces/istarwars';
import HystrixDemoService from '../../api/services/hystrix-demo.service';
import IHystrixDemoController from '../../api/interfaces/hystrix-demo-controller';
import HystrixController from '../../api/controllers/hystrix-demo/controller';
import IProduct from '../../api/interfaces/iproduct';
import IShopController from '../../api/interfaces/ishop-controller';
import ShopController from '../../api/controllers/shop/controller';
import IStarwars from '../../api/interfaces/istarwars';
import IStarwarsController from '../../api/interfaces/istarwars-controller';
import StarwarsService from '../../api/services/starwars.service';
import StarwarsController from '../../api/controllers/starwars/controller';
import SERVICE_IDENTIFIER from '../constants/identifiers';
import TAG from '../constants/tags';

import ILogger from '../interfaces/ilogger';

const container = new Container();


container.bind<ExampleController>(ExampleController).toSelf();
container.bind<IShopController>(SERVICE_IDENTIFIER.SHOP_CONTROLLER).to(ShopController);
container.bind<IHystrixDemoController>(SERVICE_IDENTIFIER.HYSTRIX_CONTROLLER).to(HystrixController);
container.bind<IStarwarsController>(SERVICE_IDENTIFIER.STARWARS_CONTROLLER).to(StarwarsController);
container.bind<ILogger>(SERVICE_IDENTIFIER.LOGGER).to(LogService);
container.bind<IExample>(SERVICE_IDENTIFIER.EXAMPLE).to(ExamplesService);
container.bind<IHystrixDemo>(SERVICE_IDENTIFIER.HYSTRIX).to(HystrixDemoService);
container.bind<IProduct>(SERVICE_IDENTIFIER.PRODUCT).to(ProductService);
container.bind<IStarwars>(SERVICE_IDENTIFIER.STARWARS).to(StarwarsService);

export default container;
