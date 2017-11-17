import { Request, Response } from 'express';

interface IMetrics {

    logAPIMetrics(req: Request, res: Response, statusCode: number): void;
}

export default IMetrics;