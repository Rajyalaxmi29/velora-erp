import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, JwtPayload, UserRole } from '../types';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError';

/**
 * Authentication check middleware.
 * Verifies the JWT token from the Authorization header (Bearer token).
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token required.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Token is invalid or expired.');
  }
};

/**
 * Role-based authorization middleware.
 * Checks if the authenticated user's role is permitted.
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required.');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Access denied: Insufficient privileges.');
    }
    next();
  };
};
export default authMiddleware;
