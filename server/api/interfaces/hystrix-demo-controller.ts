import { Request, Response } from 'express';

interface IHystrixDemoController {

  start(req: Request, res: Response): void;

  posts(req: Request, res: Response): void;

}

export default IHystrixDemoController;
