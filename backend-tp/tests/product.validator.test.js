'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateListQuery } = require('../src/validators/product.validator');

test('defaults apply when pagination params are absent', () => {
  const { errors, value } = validateListQuery({});

  assert.equal(errors, undefined);
  assert.deepEqual(value.pagination, { page: 1, limit: 10 });
});

test('rejects non-integer page and limit instead of falling back to defaults', () => {
  const { errors } = validateListQuery({ page: 'abc', limit: '1.5' });

  assert.ok(errors);
  assert.ok(errors.some((message) => message.startsWith('page')));
  assert.ok(errors.some((message) => message.startsWith('limit')));
});

test('rejects repeated query params', () => {
  for (const key of ['game', 'game_id', 'search', 'is_active', 'page', 'limit', 'sort_by', 'sort_dir']) {
    const { errors } = validateListQuery({ [key]: ['a', 'b'] });

    assert.ok(errors, key);
    assert.ok(errors.some((message) => message.startsWith(key)), key);
  }
});

test('accepts valid params', () => {
  const { errors, value } = validateListQuery({ game: ' mobile-legends ', page: '2', limit: '5', sort_by: 'price', sort_dir: 'DESC' });

  assert.equal(errors, undefined);
  assert.equal(value.filters.gameSlug, 'mobile-legends');
  assert.deepEqual(value.pagination, { page: 2, limit: 5 });
  assert.deepEqual(value.sort, { sortBy: 'price', sortDir: 'desc' });
});
