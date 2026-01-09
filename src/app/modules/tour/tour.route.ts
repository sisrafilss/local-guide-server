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
router.get(
  '/',
  // checkAuth(UserRole.GUIDE, UserRole.ADMIN),
  TourController.getAllTours
);

// get /api/tours
router.get(
  '/:id',
  // checkAuth(...Object.values(UserRole)),
  TourController.getTourById
);

// delete /api/tours/:id
router.delete(
  '/:id',
  checkAuth(UserRole.GUIDE, UserRole.ADMIN),
  TourController.deleteTourById
);

export const tourRoutes = router;
