import httpStatus from 'http-status';

import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { UserService } from './user.service';

const createTourist = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    profilePicUrl: req.file?.path,
  };

  const result = await UserService.createTourist(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tourist created successfully',
    data: result,
  });
});

export const UserController = {
  createTourist,
};
