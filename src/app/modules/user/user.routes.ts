import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

// POST /api/users/tourist
router.post(
  '/tourist',
  // validateRequest(createTouristSchema),
  UserController.createTourist
);

export const userRoutes = router;
