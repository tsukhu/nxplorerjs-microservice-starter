import ExamplesService from '../../services/examples.service';
import { Request, Response } from 'express';
import { Quote } from '../../models/quote.model';
import * as bunyan from 'bunyan';

const l: bunyan = bunyan.createLogger({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID
});
export class Controller {
  public all(req: Request, res: Response): void {
    ExamplesService
      .all()
      .then(
      result => res.status(200).json(result),
      error => res.status(500).json(error)
      );
  }

  public byPostsByID(req: Request, res: Response): void {
    l.info(req.originalUrl);
    ExamplesService
      .byPostsByID(req.params.id)
      .map(r => r.body)
      .timeout(7000)
      .subscribe(
      result => {
        l.info(<Quote>result);
        res.status(200).send(result);
      },
      error => {
        l.error(error);
        res.status(500).send(error);
      }
      );
  }

  public byId(req: Request, res: Response): void {
    ExamplesService
      .byId(req.params.id)
      .then(r => {
        if (r) {
          res.json(r);
        } else {
          res.status(404).end();
        }
      });
  }

  public create(req: Request, res: Response): void {
    ExamplesService
      .create(req.body.name)
      .then(r => res.status(201).location(`/api/v1/examples/${r.id}`).end());
  }

}
export default new Controller();
