import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const customerController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const customer = await customerService.create(req.body);
    sendCreated(res, customer, 'Customer created successfully.');
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const customers = await customerService.getAll(search, status);
    sendSuccess(res, customers, 'Customers fetched successfully.');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const customer = await customerService.getById(id);
    sendSuccess(res, customer, 'Customer details fetched successfully.');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const customer = await customerService.update(id, req.body);
    sendSuccess(res, customer, 'Customer updated successfully.');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await customerService.delete(id);
    sendNoContent(res);
  }),
};
export default customerController;
