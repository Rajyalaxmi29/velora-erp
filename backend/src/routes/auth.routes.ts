import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, validate } from '../middleware';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);
router.get('/auth/profile', authMiddleware, authController.getProfile);

export default router;
