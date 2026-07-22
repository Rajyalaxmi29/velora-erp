import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  role: z.enum(['Admin', 'Sales', 'Warehouse', 'Accounts']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});
