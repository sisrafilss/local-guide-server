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

router.get(
  '/guides',
  checkAuth(UserRole.TOURIST),
  TouristDashboardController.getMyGuides
);

router.get(
  '/cities',
  checkAuth(UserRole.TOURIST),
  TouristDashboardController.getMyCities
);

export const touristDashboardRoutes = router;
