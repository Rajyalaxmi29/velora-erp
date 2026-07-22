import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import { z } from 'zod';
import { createChallanSchema } from '../validators/challan.validator';
import { inventoryService } from './inventory.service';

type CreateChallanInput = z.infer<typeof createChallanSchema>;

export const challanService = {
  create: async (input: CreateChallanInput, createdBy: string) => {
    return prisma.$transaction(async (tx) => {
      // 1. Verify Customer
      const customer = await tx.customer.findUnique({ where: { id: input.customerId } });
      if (!customer) throw new NotFoundError('Customer');

      // 2. Generate Unique Challan Number
      const count = await tx.salesChallan.count();
      const challanNumber = `CH-${String(count + 1).padStart(3, '0')}`;

      // 3. Resolve products and construct snapshot items
      let grandTotal = 0;
      let grandQuantity = 0;
      const challanItemsData = [];

      for (const item of input.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundError(`Product (${item.productId})`);

        const subtotal = product.unitPrice * item.quantity;
        grandTotal += subtotal;
        grandQuantity += item.quantity;

        challanItemsData.push({
          productId: item.productId,
          productName: product.name, // Snapshot name
          quantity: item.quantity,
          price: product.unitPrice,  // Snapshot price
          subtotal,
        });
      }

      // 4. Create Sales Challan with items
      return tx.salesChallan.create({
        data: {
          challanNumber,
          customerId: input.customerId,
          customerName: customer.name,
          grandTotal,
          grandQuantity,
          status: 'Draft',
          createdBy,
          createdDate: new Date().toISOString().split('T')[0],
          items: {
            create: challanItemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });
  },

  getAll: async (status?: string) => {
    const where: any = {};
    if (status && status !== 'All') {
      where.status = status;
    }
    return prisma.salesChallan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  },

  getById: async (id: string) => {
    const challan = await prisma.salesChallan.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!challan) throw new NotFoundError('Sales Challan');
    return challan;
  },

  update: async (id: string, input: CreateChallanInput) => {
    return prisma.$transaction(async (tx) => {
      const challan = await tx.salesChallan.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!challan) throw new NotFoundError('Sales Challan');
      if (challan.status !== 'Draft') {
        throw new BadRequestError('Only draft challans can be updated.');
      }

      // Verify Customer
      const customer = await tx.customer.findUnique({ where: { id: input.customerId } });
      if (!customer) throw new NotFoundError('Customer');

      // Clear old items
      await tx.challanItem.deleteMany({ where: { challanId: id } });

      // Resolve products and construct snapshot items
      let grandTotal = 0;
      let grandQuantity = 0;
      const challanItemsData = [];

      for (const item of input.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundError(`Product (${item.productId})`);

        const subtotal = product.unitPrice * item.quantity;
        grandTotal += subtotal;
        grandQuantity += item.quantity;

        challanItemsData.push({
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.unitPrice,
          subtotal,
        });
      }

      return tx.salesChallan.update({
        where: { id },
        data: {
          customerId: input.customerId,
          customerName: customer.name,
          grandTotal,
          grandQuantity,
          items: {
            create: challanItemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });
  },

  /**
   * Confirm Sales Challan.
   * Updates state to 'Confirmed' and reduces product inventory counts.
   */
  confirm: async (id: string, confirmedBy: string) => {
    return prisma.$transaction(async (tx) => {
      const challan = await tx.salesChallan.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!challan) throw new NotFoundError('Sales Challan');
      if (challan.status !== 'Draft') {
        throw new BadRequestError(`Only Draft challans can be confirmed. Current status: ${challan.status}`);
      }

      // Verify and deduct stock for each item
      for (const item of challan.items) {
        // Run stock deduction (recordMovement throws if currentStock < quantity)
        await inventoryService.recordMovement(
          {
            productId: item.productId,
            quantity: item.quantity,
            reason: `Dispatched on Challan ${challan.challanNumber}`,
          },
          'OUT',
          confirmedBy
        );
      }

      // Update status
      return tx.salesChallan.update({
        where: { id },
        data: { status: 'Confirmed' },
        include: { items: true },
      });
    });
  },

  /**
   * Cancel Sales Challan.
   * Cancels challan. Returns items back to stock if it was already Confirmed.
   */
  cancel: async (id: string, cancelledBy: string) => {
    return prisma.$transaction(async (tx) => {
      const challan = await tx.salesChallan.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!challan) throw new NotFoundError('Sales Challan');
      if (challan.status === 'Cancelled') {
        throw new BadRequestError('Challan is already cancelled.');
      }

      // If it was already confirmed and stock was deducted, return stock back to warehouse
      if (challan.status === 'Confirmed') {
        for (const item of challan.items) {
          await inventoryService.recordMovement(
            {
              productId: item.productId,
              quantity: item.quantity,
              reason: `Returned to stock from cancelled Challan ${challan.challanNumber}`,
            },
            'IN',
            cancelledBy
          );
        }
      }

      return tx.salesChallan.update({
        where: { id },
        data: { status: 'Cancelled' },
        include: { items: true },
      });
    });
  },
};
export default challanService;
