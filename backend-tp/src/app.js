'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const { apiRateLimiter } = require('./middlewares/rate-limit.middleware');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const { successResponse } = require('./utils/response');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Root
app.get('/', (req, res) => successResponse(res, null, 'Topup API'));

// API routes
app.use('/api', apiRateLimiter, routes);

// Catch-all & error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
