'use strict';

const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.get('/', productController.listProducts);
router.get('/:sku', productController.getProduct);

module.exports = router;
