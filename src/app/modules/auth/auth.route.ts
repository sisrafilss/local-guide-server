import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { authValidationZodSchema } from './auth.validation';

const router = express.Router();

// POST /api/v1/auth/login
router.post(
  '/login',
  validateRequest(authValidationZodSchema),
  AuthController.login
);

router.post('/refresh-token', AuthController.refreshToken);

export const authRouter = router;
