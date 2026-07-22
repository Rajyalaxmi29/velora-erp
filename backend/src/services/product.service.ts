import prisma from '../config/database';
import { NotFoundError, ConflictError } from '../utils/AppError';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productService = {
  create: async (input: CreateProductInput) => {
    const existing = await prisma.product.findUnique({ where: { sku: input.sku } });
    if (existing) throw new ConflictError(`Product with SKU ${input.sku} already exists.`);
    return prisma.product.create({ data: input });
  },

  getAll: async (search?: string) => {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    return prisma.product.findMany({
      where,
      orderBy: { sku: 'asc' },
    });
  },

  getById: async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    return product;
  },

  update: async (id: string, input: UpdateProductInput) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    return prisma.product.update({
      where: { id },
      data: input,
    });
  },

  delete: async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    await prisma.product.delete({ where: { id } });
    return { id };
  },
};
export default productService;
