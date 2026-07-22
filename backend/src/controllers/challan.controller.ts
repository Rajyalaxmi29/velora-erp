import { Response } from 'express';
import { challanService } from '../services/challan.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types';

export const challanController = {
  create: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const creator = req.user?.name ? `${req.user.name} (${req.user.role})` : 'Sales Staff';
    const challan = await challanService.create(req.body, creator);
    sendCreated(res, challan, 'Sales Challan created successfully in Draft mode.');
  }),

  update: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const challan = await challanService.update(id, req.body);
    sendSuccess(res, challan, 'Sales Challan updated successfully.');
  }),

  getAll: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const status = req.query.status as string | undefined;
    const challans = await challanService.getAll(status);
    sendSuccess(res, challans, 'Sales Challans fetched successfully.');
  }),

  getById: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const challan = await challanService.getById(id);
    sendSuccess(res, challan, 'Sales Challan details fetched successfully.');
  }),

  confirm: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const confirmedBy = req.user?.name ? `${req.user.name} (${req.user.role})` : 'Staff';
    const id = req.params.id as string;
    const challan = await challanService.confirm(id, confirmedBy);
    sendSuccess(res, challan, 'Sales Challan confirmed. Warehouse stock has been adjusted.');
  }),

  cancel: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const cancelledBy = req.user?.name ? `${req.user.name} (${req.user.role})` : 'Staff';
    const id = req.params.id as string;
    const challan = await challanService.cancel(id, cancelledBy);
    sendSuccess(res, challan, 'Sales Challan cancelled. Warehouse stock has been reverted if previously confirmed.');
  }),
};
export default challanController;
