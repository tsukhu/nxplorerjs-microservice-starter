import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import * as bunyan from 'bunyan';

const l: bunyan = bunyan.createLogger({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID
});
export class Controller {

  public getPeopleById(req: Request, res: Response): void {
    StarwarsService
      .getPeopleById(req.params.id)
      .subscribe(r => {
        if (r === undefined) {
          res.status(404).end();
        } else {
          res.status(200).json(r);
        }
      },
      err => {
        res.status(404).json(err);
      });
  }


}
export default new Controller();
