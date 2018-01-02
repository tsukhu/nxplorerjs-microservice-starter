import container from '../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import IUser from '../../api/interfaces/iuser';
import { User } from '../../common/models/security.model';

const UserService = container.get<IUser>(SERVICE_IDENTIFIER.USER);

/**
 * User GraphQL resolver
 */
export default {
  RootMutationType: {
    login: async (parent, args, context, info) => {
      const email = args.email;
      const password = args.password;
      const userId = UserService.findUserIdForEmail(email);
      const RSA_PRIVATE_KEY = fs.readFileSync(process.env.RSA_PRIVATE_KEY_FILE);
      const expiryTime =
        process.env.TOKEN_EXPIRY_TIME !== undefined
          ? process.env.TOKEN_EXPIRY_TIME
          : '1h';
      const jwtBearerToken = jwt.sign(
        { role: 'admin', email: email },
        RSA_PRIVATE_KEY,
        {
          algorithm: 'RS256',
          expiresIn: expiryTime,
          subject: userId
        }
      );
      const user: User = {
        email: email,
        id: userId,
        role: 'admin',
        jwt: jwtBearerToken
      };
      context.user = Promise.resolve(user);
      return Promise.resolve(user);
    }
  }
};
