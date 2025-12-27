import { UserRole } from '@prisma/client';
import express from 'express';
import { multerUpload } from '../../../config/multer.config';
import checkAuth from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { GuideController } from './guide.controller';
import { updateGuideZodSchema } from './guide.validation';

const router = express.Router();

router.get('/', checkAuth(UserRole.ADMIN), GuideController.getAllGuides);

router.get(
  '/:id',
  checkAuth(UserRole.ADMIN),
  GuideController.getSingleGuideById
);
router.get(
  '/:id',
  checkAuth(UserRole.ADMIN),
  GuideController.getSingleGuideById
);

router.patch(
  '/:id',
  multerUpload.single('file'),
  validateRequest(updateGuideZodSchema),
  checkAuth(UserRole.ADMIN),
  GuideController.updateGuideById
);

router.delete(
  '/:id',
  checkAuth(UserRole.ADMIN),
  GuideController.deleteGuidetById
);

export const guideRoutes = router;
