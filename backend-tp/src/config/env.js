'use strict';

require('dotenv').config();

const REQUIRED_KEYS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'];

const missingKeys = REQUIRED_KEYS.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  },
};

env.isProduction = env.nodeEnv === 'production';

module.exports = env;
