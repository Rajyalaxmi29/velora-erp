import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import { z } from 'zod';
import { recordMovementSchema } from '../validators/inventory.validator';

type RecordMovementInput = z.infer<typeof recordMovementSchema>;

export const inventoryService = {
  /**
   * Adjust product stock.
   * Leverages Prisma transactions to ensure isolation and check that currentStock remains non-negative.
   */
  recordMovement: async (
    input: RecordMovementInput,
    type: 'IN' | 'OUT',
    createdBy: string
  ) => {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) throw new NotFoundError('Product');

      let nextStock = product.currentStock;
      if (type === 'IN') {
        nextStock += input.quantity;
      } else {
        if (product.currentStock < input.quantity) {
          throw new BadRequestError(
            `Insufficient stock for ${product.name}. Requested: ${input.quantity}, Available: ${product.currentStock}.`
          );
        }
        nextStock -= input.quantity;
      }

      // Update product current stock count
      await tx.product.update({
        where: { id: input.productId },
        data: { currentStock: nextStock },
      });

      // Record stock audit trail movement entry
      return tx.stockMovement.create({
        data: {
          productId: input.productId,
          type,
          quantity: input.quantity,
          reason: input.reason,
          createdBy,
        },
        include: {
          product: {
            select: {
              sku: true,
              name: true,
              currentStock: true,
            },
          },
        },
      });
    });
  },

  /**
   * Fetch full list of stock movements.
   */
  getMovements: async () => {
    return prisma.stockMovement.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        product: {
          select: {
            sku: true,
            name: true,
          },
        },
      },
    });
  },
};
export default inventoryService;
