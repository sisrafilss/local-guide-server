import { UserRole } from '@prisma/client';
import express from 'express';
import { multerUpload } from '../../../config/multer.config';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import {
  createAdminSchema,
  createGuideSchema,
  createTouristSchema,
} from './user.validation';

const router = express.Router();

router.get('/', checkAuth(UserRole.ADMIN), UserController.getAllUsers);

// POST /api/users/create-tourist
router.post(
  '/create-tourist',
  multerUpload.single('file'),
  validateRequest(createTouristSchema),
  UserController.createTourist
);

// POST /api/users/create-guide
router.post(
  '/create-guide',
  checkAuth(UserRole.ADMIN),
  multerUpload.single('file'),
  validateRequest(createGuideSchema),
  UserController.createGuide
);

// POST /api/users/create-admin
router.post(
  '/create-admin',
  checkAuth(UserRole.ADMIN),
  multerUpload.single('file'),
  validateRequest(createAdminSchema),
  UserController.createAdmin
);

// POST /api/users/:ID
router.delete(
  '/:id',
  checkAuth(...Object.values(UserRole)),
  UserController.deleteUser
);

export const userRoutes = router;
