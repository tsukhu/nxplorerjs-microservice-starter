import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { HttpStatus } from '../../services/http-status-codes';
import container from '../../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';
import { inject, injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

import ILogger from '../../../common/interfaces/ilogger';

import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpDelete,
  request,
  queryParam,
  response,
  requestParam
} from 'inversify-express-utils';

// Generated using https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9
const RSA_PRIVATE_KEY = fs.readFileSync(process.env.RSA_PRIVATE_KEY_FILE);

/**
 * Controller for Security Token
 */
@controller('/login')
class SecurityController implements interfaces.Controller {
  public loggerService: ILogger;

  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.loggerService = loggerService;
  }

  /**
   * Login Request
   * @param req request
   * @param res response
   */
  @httpPost('/')
  public login(@request() req: Request, @response() res: Response): void {
    const email = req.body.email,
      password = req.body.password;
    if (this.validateEmailAndPassword(email, password)) {
      const userId = this.findUserIdForEmail(email);

      const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: 120,
        subject: userId
      });

      res.status(HttpStatus.OK).send(jwtBearerToken);
    } else {
      res.sendStatus(401);
    }
  }

  private validateEmailAndPassword(email, password): boolean {
    return true;
  }

  private findUserIdForEmail(email): string {
    return email;
  }
}
export default SecurityController;
