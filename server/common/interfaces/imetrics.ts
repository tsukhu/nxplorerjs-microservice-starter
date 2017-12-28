import { Request, Response } from 'express';
import { Controller } from 'tsoa';

interface IMetrics {

    logAPIMetrics(req: Request, res: Response, statusCode: number): void;
    APIMetrics(req: Request, res: Controller, statusCode: number): void;
}

export default IMetrics;