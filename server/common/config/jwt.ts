const expressJwt = require('express-jwt');
import * as fs from 'fs';

/**
 * Setup JWT configuration
 */
export async function configJWT(): Promise<any> {
  let result: any = {};
  if (process.env.JWT_AUTH === 'true') {
    const RSA_PUBLIC_KEY = fs.readFileSync(process.env.RSA_PUBLIC_KEY_FILE);

    result = expressJwt({ secret: RSA_PUBLIC_KEY, credentialsRequired: false });
  }
  return result;
}
