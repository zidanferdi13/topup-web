'use strict';

const pool = require('../config/database');

const BASE_SELECT = `
  SELECT
    p.id,
    p.game_id,
    g.slug AS game_slug,
    g.name AS game_name,
    p.sku,
    p.name,
    p.description,
    p.price,
    p.original_price,
    p.is_active,
    p.sort_order,
    p.created_at,
    p.updated_at
  FROM products p
  INNER JOIN games g ON g.id = p.game_id
`;

function buildFilters({ gameId, gameSlug, search, isActive }) {
  const conditions = [];
  const params = [];

  if (gameId !== undefined) {
    conditions.push('p.game_id = ?');
    params.push(gameId);
  }

  if (gameSlug) {
    conditions.push('g.slug = ?');
    params.push(gameSlug);
  }

  if (search) {
    conditions.push('(p.name LIKE ? OR p.sku LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (isActive !== undefined) {
    conditions.push('p.is_active = ?');
    params.push(isActive ? 1 : 0);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  return { where, params };
}

async function findAndCount(filters, { limit, offset, sortBy, sortDir }) {
  const { where, params } = buildFilters(filters);

  const [rows] = await pool.query(
    `${BASE_SELECT} ${where} ORDER BY p.${sortBy} ${sortDir}, p.id ${sortDir} LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p INNER JOIN games g ON g.id = p.game_id ${where}`,
    params,
  );

  return { rows, total: countRows[0].total };
}

async function findBySku(sku) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.sku = ? LIMIT 1`, [sku]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

module.exports = { findAndCount, findBySku, findById };
