import { UserRole } from '@prisma/client';
import express from 'express';
import { multerUpload } from '../../../config/multer.config';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { TouristController } from './tourist.controller';
import { updateTouristZodSchema } from './tourist.validation';

const router = express.Router();

router.get('/', checkAuth(UserRole.ADMIN), TouristController.getAllTourists);

router.get(
  '/:id',
  checkAuth(UserRole.ADMIN),
  TouristController.getSingleTouristById
);

router.patch(
  '/:id',
  multerUpload.single('file'),
  validateRequest(updateTouristZodSchema),
  checkAuth(UserRole.TOURIST, UserRole.ADMIN),
  TouristController.updateTouristById
);

// DELETE /api/tourist/:id
router.delete(
  '/:id',
  checkAuth(UserRole.TOURIST, UserRole.ADMIN),
  TouristController.deleteTouristById
);

export const touristRoutes = router;
