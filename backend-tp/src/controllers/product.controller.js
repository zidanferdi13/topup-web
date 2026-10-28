'use strict';

const productService = require('../services/product.service');
const { successResponse } = require('../utils/response');

async function listProducts(req, res, next) {
  try {
    const result = await productService.getProducts(req.query);
    return successResponse(res, result, 'Products retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductBySku(req.params.sku);
    return successResponse(res, product, 'Product retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

module.exports = { listProducts, getProduct };
