import express from 'express';
import { authRouter } from '../modules/auth/auth.route';
import { bookingRoutes } from '../modules/booking/booking.route';
import { guideRoutes } from '../modules/guide/guide.route';
import { tourRoutes } from '../modules/tour/tour.route';
import { touristRoutes } from '../modules/tourist/tourist.route';
import { userRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/tours',
    route: tourRoutes,
  },
  {
    path: '/booking',
    route: bookingRoutes,
  },
  {
    path: '/tourist',
    route: touristRoutes,
  },
  {
    path: '/guide',
    route: guideRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
