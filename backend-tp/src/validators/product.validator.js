'use strict';

const SORT_FIELDS = ['id', 'name', 'price', 'sort_order', 'created_at'];
const SORT_DIRS = ['asc', 'desc'];
const MAX_LIMIT = 100;

function parseBoolean(value) {
  if (value === undefined) return undefined;

  const normalized = String(value).toLowerCase();

  if (['1', 'true', 'yes'].includes(normalized)) return true;
  if (['0', 'false', 'no'].includes(normalized)) return false;

  return null;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseInteger(value) {
  if (value === undefined) return undefined;

  const parsed = Number(value);

  return Number.isInteger(parsed) ? parsed : null;
}

function validateListQuery(query) {
  const errors = [];

  let gameId;
  if (query.game_id !== undefined) {
    gameId = String(query.game_id).trim();

    if (!UUID_PATTERN.test(gameId)) {
      errors.push('game_id must be a valid UUID');
    }
  }

  const isActive = 'is_active' in query ? parseBoolean(query.is_active) : true;
  if (isActive === null) {
    errors.push('is_active must be a boolean');
  }

  const page = parseInteger(query.page) ?? 1;
  if (page < 1) {
    errors.push('page must be greater than or equal to 1');
  }

  const limit = parseInteger(query.limit) ?? 10;
  if (limit < 1 || limit > MAX_LIMIT) {
    errors.push(`limit must be between 1 and ${MAX_LIMIT}`);
  }

  const sortBy = query.sort_by ?? 'sort_order';
  if (!SORT_FIELDS.includes(sortBy)) {
    errors.push(`sort_by must be one of: ${SORT_FIELDS.join(', ')}`);
  }

  const sortDir = (query.sort_dir ?? 'asc').toLowerCase();
  if (!SORT_DIRS.includes(sortDir)) {
    errors.push(`sort_dir must be one of: ${SORT_DIRS.join(', ')}`);
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    value: {
      filters: {
        gameId,
        gameSlug: query.game ? String(query.game).trim() : undefined,
        search: query.search ? String(query.search).trim() : undefined,
        isActive,
      },
      pagination: { page, limit },
      sort: { sortBy, sortDir },
    },
  };
}

function validateSkuParam(sku) {
  const value = String(sku || '').trim();

  if (value.length === 0 || value.length > 100) {
    return { error: 'sku must be between 1 and 100 characters' };
  }

  return { value };
}

module.exports = { validateListQuery, validateSkuParam };
