'use strict';

const productRepository = require('../repositories/product.repository');
const { validateListQuery, validateSkuParam } = require('../validators/product.validator');

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toNumber(value) {
  return value === null || value === undefined ? null : Number(value);
}

function mapProduct(row) {
  return {
    id: row.id,
    game_id: row.game_id,
    game: {
      slug: row.game_slug,
      name: row.game_name,
    },
    sku: row.sku,
    name: row.name,
    description: row.description,
    price: toNumber(row.price),
    original_price: toNumber(row.original_price),
    is_active: Boolean(row.is_active),
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function getProducts(query = {}) {
  const { errors, value } = validateListQuery(query);

  if (errors) {
    throw createHttpError(errors.join(', '), 400);
  }

  const { filters, pagination, sort } = value;
  const offset = (pagination.page - 1) * pagination.limit;

  const { rows, total } = await productRepository.findAndCount(filters, {
    limit: pagination.limit,
    offset,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir.toUpperCase(),
  });

  const totalPages = total === 0 ? 0 : Math.ceil(total / pagination.limit);

  return {
    items: rows.map(mapProduct),
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      total_pages: totalPages,
      has_next_page: pagination.page < totalPages,
      has_prev_page: pagination.page > 1,
    },
  };
}

async function getProductBySku(sku) {
  const { error, value } = validateSkuParam(sku);

  if (error) {
    throw createHttpError(error, 400);
  }

  const row = await productRepository.findBySku(value);

  if (!row) {
    throw createHttpError(`Product with sku '${value}' not found`, 404);
  }

  return mapProduct(row);
}

module.exports = { getProducts, getProductBySku };
