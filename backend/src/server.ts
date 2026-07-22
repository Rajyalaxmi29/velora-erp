import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import prisma, { pool } from './config/database';

/**
 * Start the Velora ERP API server.
 * Connects to PostgreSQL via Prisma + pg adapter, then listens on the configured port.
 */
const startServer = async (): Promise<void> => {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.success('PostgreSQL connected via Prisma.');

    // Start Express
    app.listen(env.PORT, () => {
      logger.success(`Velora ERP API running on http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`CORS origins: ${env.CORS_ORIGIN.join(', ')}`);
      logger.info(`Health check: http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ───────────────────────────────────────────────
const shutdown = async (signal: string): Promise<void> => {
  logger.warn(`${signal} received — shutting down gracefully...`);
  await prisma.$disconnect();
  await pool.end();
  logger.info('Database connections closed.');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ─── Unhandled Rejections & Exceptions ───────────────────────────────
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error.message);
  process.exit(1);
});

startServer();
