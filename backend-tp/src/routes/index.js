'use strict';

const express = require('express');
const database = require('../config/database');
const productRoutes = require('./product.routes');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  return successResponse(res, null, 'API is running');
});

// Database health check
router.get('/health/database', async (req, res, next) => {
  try {
    await database.testConnection();
    return successResponse(res, null, 'Database connection is healthy');
  } catch (error) {
    const cause = Array.isArray(error.errors) && error.errors.length > 0
      ? error.errors.map((e) => e.message).join('; ')
      : error.message;

    error.statusCode = 503;
    error.message = `Database connection failed: ${cause}`;
    return next(error);
  }
});

// Product module
router.use('/products', productRoutes);

// Placeholder modules — routing architecture siap, business logic belum
const PLACEHOLDER_MODULES = ['player', 'orders', 'payments', 'topup', 'webhooks'];

PLACEHOLDER_MODULES.forEach((moduleName) => {
  const label = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

  router.all(`/${moduleName}`, (req, res) => {
    return errorResponse(res, `${label} module is not implemented yet`, 501);
  });

  router.all(`/${moduleName}/*`, (req, res) => {
    return errorResponse(res, `${label} module is not implemented yet`, 501);
  });
});

module.exports = router;
