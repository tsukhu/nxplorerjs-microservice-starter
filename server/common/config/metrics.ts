import { Application } from 'express';

// Init
const Prometheus = require('prom-client');

const prometheusMetrics = Prometheus.collectDefaultMetrics;

// Probe every 5th second.
prometheusMetrics({ timeout: 5000 });

/**
 * Configure Prometheus metrics and /metric endpoint
 * @param app Express Application
 */
export const configMetrics = (app: Application) => {
  // Metrics endpoint
  app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
  });
};

export default prometheusMetrics;
