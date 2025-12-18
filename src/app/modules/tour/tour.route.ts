import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { TourController } from './tour.controller';
import { CreateTourZodSchema } from './tour.validation';

const router = express.Router();

// POST /api/tours/create-tour
router.post(
  '/create-tour',
  checkAuth(UserRole.GUIDE),
  validateRequest(CreateTourZodSchema),
  TourController.createTour
);

export const tourRoutes = router;
