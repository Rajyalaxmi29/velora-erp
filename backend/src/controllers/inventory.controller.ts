import { Response } from 'express';
import { inventoryService } from '../services/inventory.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types';

export const inventoryController = {
  stockIn: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const createdBy = req.user?.name || 'Warehouse Staff';
    const movement = await inventoryService.recordMovement(req.body, 'IN', createdBy);
    sendCreated(res, movement, 'Stock recorded (IN) successfully.');
  }),

  stockOut: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const createdBy = req.user?.name || 'Warehouse Staff';
    const movement = await inventoryService.recordMovement(req.body, 'OUT', createdBy);
    sendCreated(res, movement, 'Stock recorded (OUT) successfully.');
  }),

  getHistory: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const movements = await inventoryService.getMovements();
    sendSuccess(res, movements, 'Stock movement history logs fetched.');
  }),
};
export default inventoryController;
