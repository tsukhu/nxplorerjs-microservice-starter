import * as express from 'express';
import controller from './controller';
export default express.Router()
    .get('/people/:id', controller.getPeopleById);
