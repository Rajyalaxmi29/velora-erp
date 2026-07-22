import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits.'),
  businessName: z.string().min(2, 'Business name is required.'),
  status: z.enum(['Lead', 'Active', 'Inactive'] as [string, ...string[]]).optional(),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
