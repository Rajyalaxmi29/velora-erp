import { Request, Response } from 'express';
import { healthService } from '../services/health.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Health check controller.
 */
export const healthController = {
  /**
   * GET /health
   */
  check: asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const health = await healthService.getHealth();
    sendSuccess(res, health, health.message);
  }),
};
