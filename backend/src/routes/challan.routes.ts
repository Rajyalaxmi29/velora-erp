import { Router } from 'express';
import { challanController } from '../controllers/challan.controller';
import { authMiddleware, requireRole, validate } from '../middleware';
import { createChallanSchema, idParamSchema } from '../validators';

const router = Router();

router.use('/challans', authMiddleware);

// GET/POST challans: Admin, Sales, or Accounts can view/create challans
router.get('/challans', requireRole(['Admin', 'Sales', 'Accounts']), challanController.getAll);
router.get('/challans/:id', requireRole(['Admin', 'Sales', 'Accounts']), validate(idParamSchema, 'params'), challanController.getById);
router.post('/challans', requireRole(['Admin', 'Sales']), validate(createChallanSchema), challanController.create);
router.put('/challans/:id', requireRole(['Admin', 'Sales']), validate(idParamSchema, 'params'), validate(createChallanSchema), challanController.update);

// Confirm/Cancel: Admin or Warehouse can trigger dispatches or cancels (which deducts/reverts stock)
router.post('/challans/:id/confirm', requireRole(['Admin', 'Warehouse']), validate(idParamSchema, 'params'), challanController.confirm);
router.post('/challans/:id/cancel', requireRole(['Admin', 'Warehouse']), validate(idParamSchema, 'params'), challanController.cancel);

export default router;
