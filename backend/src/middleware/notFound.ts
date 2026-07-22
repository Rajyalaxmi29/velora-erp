import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * 404 catch-all handler for undefined routes.
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  sendError(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );
};
