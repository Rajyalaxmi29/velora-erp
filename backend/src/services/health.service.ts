import prisma from '../config/database';
import { logger } from '../utils/logger';

/**
 * Health check service.
 * Verifies database connectivity and returns system status.
 */
export const healthService = {
  /**
   * Check API and database health.
   */
  getHealth: async (): Promise<{
    status: string;
    message: string;
    timestamp: string;
    uptime: number;
    database: string;
    environment: string;
  }> => {
    let dbStatus = 'disconnected';

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (err) {
      logger.warn('Database health check failed — PostgreSQL may not be running.');
      dbStatus = 'disconnected';
    }

    return {
      status: 'OK',
      message: 'Velora ERP API Running',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
    };
  },
};
