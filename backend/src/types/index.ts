import { Request } from 'express';

// ─── API Response Types ──────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Query Types ─────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
}

// ─── Auth Types ──────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'Sales' | 'Warehouse' | 'Accounts';

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── Service Result ──────────────────────────────────────────────────

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}
