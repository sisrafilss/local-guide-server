import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
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

const createGuide = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    profilePicUrl: req.file?.path,
  };

  const result = await UserService.createGuide(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Guide created successfully',
    data: result,
  });
});
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    profilePicUrl: req.file?.path,
  };

  const result = await UserService.createAdmin(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

export const UserController = {
  createTourist,
  createGuide,
  createAdmin,
};
