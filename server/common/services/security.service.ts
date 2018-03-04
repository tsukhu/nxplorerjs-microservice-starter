import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import ISecurity from '../interfaces/isecurity';
import * as fs from 'fs';

/**
 * Security Service
 */
@injectable()
class SecurityService implements ISecurity {
  // Generated using https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9
  private RSA_PRIVATE_KEY: any;

  async getPrivateKey() {
   if (this.RSA_PRIVATE_KEY === undefined) {
      this.RSA_PRIVATE_KEY = await fs.readFileSync(process.env.RSA_PRIVATE_KEY_FILE);
    }
    return (this.RSA_PRIVATE_KEY);
  }
}

export default SecurityService;
