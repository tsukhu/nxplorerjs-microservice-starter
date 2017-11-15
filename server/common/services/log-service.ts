import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import SERVICE_IDENTIFIER from '../constants/identifiers';
import ILogger from '../interfaces/ilogger';
const pino = require('pino')();

@injectable()
export class LogService implements ILogger {

    private logger: any;
    private uuid: string;

    public constructor() {
        // do something construct...
        this.initLogger();
    }

    private initLogger() {
        this.logger = pino;
    }

    public getLogger(): any {
        return this.logger;
    }

    public info(...message) {
        const UUID = this.getUUID();
        this.logger.info({ UUID, ...message });
    }

    public debug(...message) {
        const UUID = this.getUUID();
        this.logger.debug({ UUID, ...message });
    }

    public error(...message) {
        const UUID = this.getUUID();
        this.logger.error({ UUID, ...message });
    }

    public logAPITraceOut(req: Request, res: Response, message?: any) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const responseTime = res.getHeader('x-response-time');
        const status = res.status;
        const uuid = this.getUUID();
        if (message !== undefined) {
            this.logger.info({ uuid, fullUrl, status, responseTime, message });
        } else {
            this.logger.info({ uuid, fullUrl, status, responseTime });
        }
    }

    public logAPITrace(req: Request, res: Response, statusCode: number, message?: any) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const responseTime = res.getHeader('x-response-time');
        const uuid = this.getUUID();
        if (message !== undefined) {
            this.logger.info({ uuid, fullUrl, statusCode, responseTime, message });
        } else {
            this.logger.info({ uuid, fullUrl, statusCode, responseTime });
        }
    }

    public setUUID(uuid: string) {
        this.uuid = uuid;
    }

    public getUUID() {
        return this.uuid;
    }
}

export default LogService;