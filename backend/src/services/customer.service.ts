import prisma from '../config/database';
import { NotFoundError } from '../utils/AppError';
import { z } from 'zod';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator';

type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export const customerService = {
  create: async (input: CreateCustomerInput) => {
    return prisma.customer.create({ data: input });
  },

  getAll: async (search?: string, status?: string) => {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status && status !== 'All') {
      where.status = status;
    }
    return prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  },

  getById: async (id: string) => {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundError('Customer');
    return customer;
  },

  update: async (id: string, input: UpdateCustomerInput) => {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundError('Customer');
    return prisma.customer.update({
      where: { id },
      data: input,
    });
  },

  delete: async (id: string) => {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundError('Customer');
    await prisma.customer.delete({ where: { id } });
    return { id };
  },
};
export default customerService;
