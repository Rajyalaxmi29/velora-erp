import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { isDev } from './env';

/**
 * Singleton Prisma client using Prisma 7 driver adapter pattern.
 * Uses @prisma/adapter-pg for PostgreSQL connectivity.
 */
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/velora_erp?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export { pool };
export default prisma;
