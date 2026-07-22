import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authMiddleware, requireRole, validate } from '../middleware';
import { recordMovementSchema } from '../validators';

const router = Router();

// Endpoint access: Admin or Warehouse can adjust inventory counts or view histories
router.use('/stock', authMiddleware, requireRole(['Admin', 'Warehouse']));

router.post('/stock/in', validate(recordMovementSchema), inventoryController.stockIn);
router.post('/stock/out', validate(recordMovementSchema), inventoryController.stockOut);
router.get('/stock/history', inventoryController.getHistory);

export default router;
