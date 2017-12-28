import { Application } from 'express';
import SERVICE_IDENTIFIER from '../constants/identifiers';
import iocContainer from '../config/ioc';
import ILogger from '../interfaces/ilogger';
import { LogService } from '../../common/services/log.service';
const LOG = iocContainer.get<ILogger>(LogService);

/**
 * Add Logging configuration to the app server
 * @param app Express applicatton
 */
export function configLogging(app: Application) {
  app.use((req: any, res, next) => {
    // If UUID set in the cookie then add to the log for tracking
    if (req.cookies['UUID'] !== undefined) {
      LOG.setUUID(req.cookies['UUID']);
    } else {
      // unset previously set value if any
      LOG.setUUID(undefined);
    }
    next();
  });
}

export default LOG;
