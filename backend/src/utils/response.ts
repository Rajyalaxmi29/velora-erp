import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

/**
 * Standardized API response helpers.
 * Every response from the Velora API uses this format.
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: PaginationMeta
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully.'
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

export const sendError = (
  res: Response,
  message: string = 'Something went wrong.',
  statusCode: number = 500,
  errors?: { field: string; message: string }[]
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(response);
};

/**
 * Build pagination metadata from query params + total count.
 */
export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
