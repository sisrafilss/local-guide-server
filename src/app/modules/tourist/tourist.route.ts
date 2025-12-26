import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { TouristController } from './tourist.controller';

const router = express.Router();

// DELETE /api/tourist/:id
router.delete(
  '/:id',
  checkAuth(UserRole.TOURIST, UserRole.ADMIN),
  TouristController.deleteTouristById
);

router.get('/', checkAuth(UserRole.ADMIN), TouristController.getAllTourists);

router.get(
  '/:id',
  checkAuth(UserRole.ADMIN),
  TouristController.getSingleTouristById
);

export const touristRoutes = router;
