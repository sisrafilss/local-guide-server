import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import {
  authValidationZodSchema,
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
} from './auth.validation';

const router = express.Router();

// POST /api/v1/auth/login
router.post(
  '/login',
  validateRequest(authValidationZodSchema),
  AuthController.login
);

router.post('/refresh-token', AuthController.refreshToken);

router.post(
  '/change-password',
  validateRequest(changePasswordZodSchema),
  checkAuth(...Object.values(UserRole)),
  AuthController.changePassword
);

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordZodSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(resetPasswordZodSchema),
  AuthController.resetPassword
);

router.get('/me', AuthController.getMe);

export const authRouter = router;
