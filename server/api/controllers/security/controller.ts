import StarwarsService from '../../services/starwars.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs/Observable';
import { ErrorResponseBuilder } from '../../services/response-builder';
import { HttpError } from '../../models/error.model';
import { HttpStatus } from '../../services/http-status-codes';
import container from '../../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../../common/constants/identifiers';
import { inject, injectable } from 'inversify';
import IDGenerator from '../../../common/config/utils';
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

/**
 * Controller for Security Token
 */
@controller('/login')
class SecurityController implements interfaces.Controller {
  public loggerService: ILogger;
  // Generated using https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9
  private RSA_PRIVATE_KEY: any;
  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.loggerService = loggerService;
    this.RSA_PRIVATE_KEY = fs.readFileSync(process.env.RSA_PRIVATE_KEY_FILE);
  }

  /**
   * Login Request
   * @param req request
   * @param res response
   */
  @httpPost('/')
  public login(@request() req: Request, @response() res: Response): void {
    const email = req.body.email,
      password = req.body.password,
      role = req.body.role;
    if (this.validateEmailAndPassword(email, password)) {
      const userId = this.findUserIdForEmail(email);
      const expiryTime =
        process.env.TOKEN_EXPIRY_TIME !== undefined
          ? process.env.TOKEN_EXPIRY_TIME
          : '1h';
      const jwtBearerToken = jwt.sign(
        { role: role, email: email },
        this.RSA_PRIVATE_KEY,
        {
          algorithm: 'RS256',
          expiresIn: expiryTime,
          subject: userId
        }
      );

      res.status(HttpStatus.OK).json({
        idToken: jwtBearerToken,
        expiresIn: expiryTime
      });
    } else {
      res.sendStatus(401);
    }
  }

  /**
   * Email validation place holder
   * @param email
   * @param password
   */
  private validateEmailAndPassword(email, password): boolean {
    return true;
  }

  /**
   * Get the user ID based on email provided
   * Dummy implementation for showing the concept
   */
  private findUserIdForEmail(email): string {
    return IDGenerator();
  }
}
export default SecurityController;
