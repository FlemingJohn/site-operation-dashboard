import { app } from './app.js';
import { checkDatabaseConnection, pool } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const SHUTDOWN_TIMEOUT_MS = 10000;

const exitWithFatal = (error, message) => {
  logger.fatal({ err: error }, message);
  process.exit(1);
};

process.on('unhandledRejection', (reason) => exitWithFatal(reason, 'Unhandled promise rejection'));
process.on('uncaughtException', (error) => exitWithFatal(error, 'Uncaught exception'));

const listen = () =>
  app.listen(env.PORT, () => logger.info(`Server listening on port ${env.PORT}`));

const registerShutdown = (server) => {
  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down`);
    setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS).unref();

    server.close(async () => {
      await pool.end();
      logger.info('Shutdown complete');
      process.exit(0);
    });
  };

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
};

try {
  await checkDatabaseConnection();
  logger.info('Database connected');
} catch (error) {
  exitWithFatal(error, 'Cannot connect to the database');
}

registerShutdown(listen());
