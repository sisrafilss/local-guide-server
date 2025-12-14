import express from 'express';
import { multerUpload } from '../../../config/multer.config';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { createTouristSchema } from './user.validation';

const router = express.Router();

// POST /api/users/tourist
router.post(
  '/create-tourist',
  multerUpload.single('file'),
  validateRequest(createTouristSchema),
  UserController.createTourist
);

export const userRoutes = router;
