import { Request, Response } from 'express';

interface IStarwarsController {

  getPeopleById(req: Request, res: Response): void;

}

export default IStarwarsController;
