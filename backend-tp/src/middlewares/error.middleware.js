'use strict';

const env = require('../config/env');
const logger = require('../utils/logger');

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err.stack);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${err.message}`);
  }

  const message = isServerError && env.isProduction
    ? 'Internal Server Error'
    : err.message;

  const body = { success: false, message };

  if (!env.isProduction && err.stack) {
    body.stack = err.stack;
  }

  return res.status(statusCode).json(body);
}

module.exports = { notFoundHandler, errorHandler };
