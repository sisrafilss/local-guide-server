import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BookingController } from './booking.controller';
import { CreateBookingZodSchema } from './booking.validation';

const router = express.Router();

// POST /api/booking
router.post(
  '/',
  checkAuth(UserRole.TOURIST),
  validateRequest(CreateBookingZodSchema),
  BookingController.createBooking
);

// GET /api/booking
router.get(
  '/',
  checkAuth(UserRole.TOURIST, UserRole.GUIDE, UserRole.ADMIN),
  BookingController.getAllBookings
);

// GET /api/booking/:id
router.get(
  '/:id',
  checkAuth(UserRole.TOURIST, UserRole.GUIDE, UserRole.ADMIN),
  BookingController.getBookingById
);

// DELETE /api/booking/:id
router.delete(
  '/:id',
  checkAuth(UserRole.TOURIST, UserRole.ADMIN, UserRole.GUIDE),
  BookingController.deleteBookingById
);

// PATCH /api/booking/:id
router.patch(
  '/:id',
  checkAuth(UserRole.TOURIST, UserRole.ADMIN, UserRole.GUIDE),
  BookingController.updateBookingById
);

export const bookingRoutes = router;
