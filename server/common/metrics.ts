import { Request, Response } from 'express';
const Prometheus = require('prom-client');
const httpRequestDurationMicroseconds = new Prometheus.Summary({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route', 'statusCode'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});


export class AppMetrics {
    private static instance: AppMetrics;

    private constructor() {
        // do something construct...
    }
    static getInstance() {
        if (!AppMetrics.instance) {
            AppMetrics.instance = new AppMetrics();
            // ... any one time initialization goes here ...
        }
        return AppMetrics.instance;
    }

    logAPIMetrics(req: Request, res: Response, statusCode: number) {
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const responseTime = res.getHeader('x-response-time');
        httpRequestDurationMicroseconds
          .labels(fullUrl, statusCode)
          .observe(responseTime);
    }
}