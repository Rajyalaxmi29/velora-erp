import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response';

/**
 * Generic Zod validation middleware factory.
 * Validates `req.body`, `req.query`, or `req.params` against a schema.
 *
 * Usage:
 *   router.post('/items', validate(createItemSchema), controller.create);
 *   router.get('/items', validate(querySchema, 'query'), controller.list);
 */
export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const issues = (result.error as any).issues || (result.error as any).errors || [];
      const errors = issues.map((e: any) => ({
        field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
        message: e.message || 'Validation error',
      }));
      sendError(res, 'Validation failed.', 400, errors);
      return;
    }

    // Replace the source with parsed (cleaned & coerced) data
    (req as any)[source] = result.data;
    next();
  };
};
