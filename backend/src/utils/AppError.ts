/**
 * Custom API Error class with HTTP status code.
 * Thrown from services/controllers and caught by the global error handler.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Preserve correct prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Common Error Factories ──────────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found.`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action.') {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Invalid request.') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists.') {
    super(message, 409);
  }
}
