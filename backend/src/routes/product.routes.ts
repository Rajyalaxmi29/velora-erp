import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authMiddleware, requireRole, validate } from '../middleware';
import { createProductSchema, updateProductSchema, idParamSchema } from '../validators';

const router = Router();

// Endpoint access: Admin or Warehouse can manage products
router.use('/products', authMiddleware, requireRole(['Admin', 'Warehouse']));

router.post('/products', validate(createProductSchema), productController.create);
router.get('/products', productController.getAll);
router.get('/products/:id', validate(idParamSchema, 'params'), productController.getById);
router.put('/products/:id', validate(idParamSchema, 'params'), validate(updateProductSchema), productController.update);
router.delete('/products/:id', validate(idParamSchema, 'params'), productController.delete);

export default router;
