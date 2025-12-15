import express from 'express';
import { multerUpload } from '../../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import {
  createAdminSchema,
  createGuideSchema,
  createTouristSchema,
} from './user.validation';

const router = express.Router();

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
  multerUpload.single('file'),
  validateRequest(createGuideSchema),
  UserController.createGuide
);
// POST /api/users/create-admin
router.post(
  '/create-admin',
  multerUpload.single('file'),
  validateRequest(createAdminSchema),
  UserController.createAdmin
);

export const userRoutes = router;
