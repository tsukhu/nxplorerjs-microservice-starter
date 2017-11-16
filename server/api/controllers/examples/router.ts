import * as express from 'express';

import container from '../../../common/config/ioc_config';
import ILogger from '../../../common/interfaces/ilogger';
import IExample from '../../interfaces/iexample';
import ExampleController from './controller';

import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';

const controller = container.get<ExampleController>(ExampleController);

export default express.Router()
    .post('/', controller.create)
    .get('/', controller.all)
    .get('/:id', controller.byPostsByID); // controller.byId)
