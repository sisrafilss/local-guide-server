import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { userFilterableFields } from './user.constant';
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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const deleteUser = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const result = await UserService.deleteUser(
      req.params.id,
      req.user as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users data fetched!',

      data: result,
    });
  }
);

export const UserController = {
  createTourist,
  createGuide,
  createAdmin,
  getAllUsers,
  deleteUser,
};
