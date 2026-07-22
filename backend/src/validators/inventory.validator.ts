import { z } from 'zod';

export const recordMovementSchema = z.object({
  productId: z.string().uuid('Invalid product ID.'),
  quantity: z.number().int().positive('Quantity must be a positive integer.'),
  reason: z.string().min(2, 'Reason is required.'),
});
