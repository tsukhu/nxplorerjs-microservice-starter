import { Request, Response } from 'express';
import * as bunyan from 'bunyan';

const bunyanOpts = {
    name: 'myapp',
    streams: [
        {
            level: process.env.LOG_LEVEL,
            stream: process.stdout,       // log INFO and above to stdout
            type: 'stream'
        },
        {
            path: './logs/appliction.log',  // log ERROR and above to a file
            type: 'file'
        }
    ]
};


export class LogManager {
    private static instance: LogManager;
    private logger: bunyan;

    private constructor() {
        // do something construct...
    }
    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
            // ... any one time initialization goes here ...
            LogManager.instance.initLogger(bunyan.createLogger(bunyanOpts));
        }
        return LogManager.instance;
    }

    private initLogger(logger: bunyan) {
        this.logger = logger;
    }

    public getLogger(): bunyan {
        return this.logger;
    }

    public logAPITrace(req: Request, res: Response, statusCode: number, message?: any) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const responseTime = res.getHeader('x-response-time');
        if (message !== undefined) {
            this.logger.info({ fullUrl, statusCode, responseTime, message });
        } else {
            this.logger.info({ fullUrl, statusCode , responseTime });
        }
    }
}