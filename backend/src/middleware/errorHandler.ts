import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { isDev } from '../config/env';
import { ZodError } from 'zod';

/**
 * Global error handler middleware.
 * Catches all errors thrown in controllers/services and returns
 * a consistent JSON response.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ── Zod Validation Errors ────────────────────────────────────────
  if (err instanceof ZodError) {
    const issues = (err as any).issues || (err as any).errors || [];
    const errors = issues.map((e: any) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
      message: e.message || 'Validation error',
    }));
    sendError(res, 'Validation failed.', 400, errors);
    return;
  }

  // ── Known Operational Errors ─────────────────────────────────────
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // ── Unknown / Programmer Errors ──────────────────────────────────
  logger.error('Unhandled Error:', err.message, isDev ? err.stack : '');

  sendError(
    res,
    isDev ? err.message : 'Internal server error.',
    500
  );
};
