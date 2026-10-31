'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

// Dummy config so the app loads; these tests never reach the database.
Object.assign(process.env, {
  NODE_ENV: 'test',
  DB_HOST: '127.0.0.1',
  DB_PORT: '3306',
  DB_NAME: 'topup_test',
  DB_USER: 'test',
});

const app = require('../src/app');
const pool = require('../src/config/database');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

test('placeholder modules respond 501 with success false', async () => {
  for (const path of ['/api/orders', '/api/payments/123']) {
    const response = await fetch(`${baseUrl}${path}`);
    const body = await response.json();

    assert.equal(response.status, 501, path);
    assert.equal(body.success, false, path);
  }
});

test('repeated sort_dir returns 400, not 500', async () => {
  const response = await fetch(`${baseUrl}/api/products?sort_dir=asc&sort_dir=desc`);
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
});

test('invalid page returns 400', async () => {
  const response = await fetch(`${baseUrl}/api/products?page=abc`);

  assert.equal(response.status, 400);
});
