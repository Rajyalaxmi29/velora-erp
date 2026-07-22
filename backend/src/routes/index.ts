import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import productRoutes from './product.routes';
import inventoryRoutes from './inventory.routes';
import challanRoutes from './challan.routes';

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(customerRoutes);
router.use(productRoutes);
router.use(inventoryRoutes);
router.use(challanRoutes);

export default router;
