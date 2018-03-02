const compression = require('compression');
import * as express from 'express';

/**
 * Add Swagger Middleware and setup the UI route for swagger
 * @param app Express App
 */
export const addCompression = (app: express.Application) => {
  app.use(compression({ filter: shouldCompress }));
};

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
};
