import * as express from 'express';
import controller from './controller';
export default express.Router()
    .get('/start', controller.start)
    .get('/posts', controller.posts);
