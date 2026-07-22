import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters.'),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required.'),
  unitPrice: z.number().positive('Price must be positive.'),
  currentStock: z.number().int().nonnegative('Stock cannot be negative.').optional(),
  minStock: z.number().int().nonnegative('Min stock limit cannot be negative.').optional(),
  warehouse: z.string().min(2, 'Warehouse location is required.'),
});

export const updateProductSchema = createProductSchema.partial();
