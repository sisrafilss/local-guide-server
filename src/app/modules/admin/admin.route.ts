import { UserRole } from '@prisma/client';
import express from 'express';
import { multerUpload } from '../../../config/multer.config';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { updateAdminZodSchema } from './admin.validation';

const router = express.Router();

// -------------------- GET ALL ADMINS --------------------
router.get('/', checkAuth(UserRole.ADMIN), AdminController.getAllAdmins);

router.get(
  '/stats',
  checkAuth(...Object.values(UserRole)),
  AdminController.getStats
);

// -------------------- GET SINGLE ADMIN --------------------
router.get(
  '/:id',
  checkAuth(UserRole.ADMIN),
  AdminController.getSingleAdminById
);

// -------------------- UPDATE ADMIN --------------------
router.patch(
  '/:id',
  multerUpload.single('file'),
  validateRequest(updateAdminZodSchema),
  checkAuth(UserRole.ADMIN),
  AdminController.updateAdminById
);

// -------------------- DELETE ADMIN --------------------
router.delete(
  '/:id',
  checkAuth(UserRole.ADMIN),
  AdminController.deleteAdminById
);

export const adminRoutes = router;
