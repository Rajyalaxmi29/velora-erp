import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { authMiddleware, requireRole, validate } from '../middleware';
import { createCustomerSchema, updateCustomerSchema, idParamSchema } from '../validators';

const router = Router();

// Endpoint access: Admin or Sales can manage customers
router.use('/customers', authMiddleware, requireRole(['Admin', 'Sales']));

router.post('/customers', validate(createCustomerSchema), customerController.create);
router.get('/customers', customerController.getAll);
router.get('/customers/:id', validate(idParamSchema, 'params'), customerController.getById);
router.put('/customers/:id', validate(idParamSchema, 'params'), validate(updateCustomerSchema), customerController.update);
router.delete('/customers/:id', validate(idParamSchema, 'params'), customerController.delete);

export default router;
