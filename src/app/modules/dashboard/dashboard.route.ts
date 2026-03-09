import { UserRole } from '@prisma/client';
import express from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get(
  '/admin',
  checkAuth(UserRole.ADMIN),
  DashboardController.getAdminDashboard
);

router.get(
  '/guide',
  checkAuth(UserRole.GUIDE),
  DashboardController.getGuideDashboard
);

router.get(
  '/tourist',
  checkAuth(UserRole.TOURIST),
  DashboardController.getTouristDashboard
);

export const dashboardRoutes = router;
