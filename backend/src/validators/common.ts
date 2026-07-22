import { z } from 'zod';

/**
 * Reusable Zod schemas for common fields.
 * Future module validators will compose these.
 */

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = paginationSchema.extend({
  search: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format.'),
});
