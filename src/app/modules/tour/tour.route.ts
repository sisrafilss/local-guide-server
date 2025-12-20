import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { TourController } from './tour.controller';
import { CreateTourZodSchema, UpdateTourZodSchema } from './tour.validation';

const router = express.Router();

// POST /api/tours
router.post(
  '/',
  checkAuth(UserRole.GUIDE),
  validateRequest(CreateTourZodSchema),
  TourController.createTour
);

// PATCH /api/tours/:id
router.patch(
  '/:id',
  checkAuth(UserRole.GUIDE),
  validateRequest(UpdateTourZodSchema),
  TourController.updateTour
);

// get /api/tours
router.get('/', checkAuth(UserRole.GUIDE), TourController.getAllTours);

export const tourRoutes = router;
