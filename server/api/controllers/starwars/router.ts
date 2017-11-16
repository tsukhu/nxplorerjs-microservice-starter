import * as express from 'express';
import container from '../../../common/config/ioc_config';
import IStarwarsController from '../../interfaces/istarwars-controller';

import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';

const controller = container.get<IStarwarsController>(SERVICE_IDENTIFIER.STARWARS_CONTROLLER);
export default express.Router()
    .get('/people/:id', controller.getPeopleById);
