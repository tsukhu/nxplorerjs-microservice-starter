import { Request, Response } from 'express';

interface ILogger {

    info(...message);

    debug(...message);

    error(...message);

    logAPITraceOut(req: Request, res: Response, message?: any);

    logAPITrace(req: Request, res: Response, statusCode: number, message?: any);

    setUUID(uuid: string);

    getUUID();
}

export default ILogger;