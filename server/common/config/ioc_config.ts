import 'reflect-metadata';

import { Container } from 'inversify';

import LogService from '../services/log.service';
import MetricsService from '../services/metrics.service';
import ExamplesService from '../../api/services/examples.service';
import ExampleController from '../../api/controllers/examples/controller';
import IExample from '../../api/interfaces/iexample';
import IHystrixDemo from '../../api/interfaces/ihystrix-demo';
import ProductService from '../../api/services/product.service';
import IStarwarsService from '../../api/interfaces/istarwars';
import HystrixDemoService from '../../api/services/hystrix-demo.service';
import HystrixController from '../../api/controllers/hystrix-demo/controller';
import IProduct from '../../api/interfaces/iproduct';
import ShopController from '../../api/controllers/shop/controller';
import IStarwars from '../../api/interfaces/istarwars';
import StarwarsService from '../../api/services/starwars.service';
import StarwarsController from '../../api/controllers/starwars/controller';
import SERVICE_IDENTIFIER from '../constants/identifiers';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import TAG from '../constants/tags';

import ILogger from '../interfaces/ilogger';
import IMetrics from '../interfaces/imetrics';

const container = new Container();

// note that you *must* bind your controllers to Controller
container.bind<interfaces.Controller>(TYPE.Controller).to(ExampleController).whenTargetNamed('ExampleController');
container.bind<interfaces.Controller>(TYPE.Controller).to(HystrixController).whenTargetNamed('HystrixController');
container.bind<interfaces.Controller>(TYPE.Controller).to(ShopController).whenTargetNamed('ShopController');
container.bind<interfaces.Controller>(TYPE.Controller).to(StarwarsController).whenTargetNamed('StarwarsController');
container.bind<IExample>(SERVICE_IDENTIFIER.EXAMPLE).to(ExamplesService);
container.bind<IHystrixDemo>(SERVICE_IDENTIFIER.HYSTRIX).to(HystrixDemoService);
container.bind<IProduct>(SERVICE_IDENTIFIER.PRODUCT).to(ProductService);
container.bind<IStarwars>(SERVICE_IDENTIFIER.STARWARS).to(StarwarsService);
container.bind<ILogger>(SERVICE_IDENTIFIER.LOGGER).to(LogService).inSingletonScope();
container.bind<IMetrics>(SERVICE_IDENTIFIER.METRICS).to(MetricsService).inSingletonScope();

export default container;
