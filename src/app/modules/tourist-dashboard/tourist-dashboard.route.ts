import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { TouristDashboardController } from './tourist-dashboard.controller';

const router = express.Router();

router.get(
  '/bookings',
  checkAuth(UserRole.TOURIST),
  TouristDashboardController.getMyBookings
);

router.get(
  '/bookings/:id',
  checkAuth(UserRole.TOURIST),
  TouristDashboardController.getMyBookingById
);

router.patch(
  '/bookings/:id/cancel',
  checkAuth(UserRole.TOURIST),
  TouristDashboardController.cancelMyBooking
);

export const touristDashboardRoutes = router;
