import * as express from 'express';

import container from '../../../common/config/ioc_config';
import IHystrixDemoController from '../../interfaces/hystrix-demo-controller';

import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';

const controller = container.get<IHystrixDemoController>(SERVICE_IDENTIFIER.HYSTRIX_CONTROLLER);

export default express.Router()
    .get('/start', controller.start)
    .get('/posts', controller.posts);
