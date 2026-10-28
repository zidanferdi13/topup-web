'use strict';

const app = require('./app');
const env = require('./config/env');
const database = require('./config/database');
const logger = require('./utils/logger');

let server;

async function start() {
  try {
    await database.testConnection();
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Unable to connect to database', error.message);
    process.exitCode = 1;
    return;
  }

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });

  server.on('error', (error) => {
    logger.error('HTTP server error', error.message);
    process.exitCode = 1;
  });
}

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await database.end();
  logger.info('Shutdown complete');
  process.exit(0);
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal).catch((error) => {
      logger.error('Error during shutdown', error.message);
      process.exit(1);
    });
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason);
});

start();
