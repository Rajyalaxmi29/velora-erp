import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

/**
 * GET /health
 * Returns API status, uptime, database connectivity, and environment.
 */
router.get('/health', healthController.check);

export default router;
