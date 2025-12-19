import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { TourController } from './tour.controller';
import { CreateTourZodSchema, UpdateTourZodSchema } from './tour.validation';

const router = express.Router();

// POST /api/tours/create-tour
router.post(
  '/create-tour',
  checkAuth(UserRole.GUIDE),
  validateRequest(CreateTourZodSchema),
  TourController.createTour
);

// POST /api/tours/update-tour/:id
router.patch(
  '/:id',
  checkAuth(UserRole.GUIDE),
  validateRequest(UpdateTourZodSchema),
  TourController.updateTour
);

export const tourRoutes = router;
