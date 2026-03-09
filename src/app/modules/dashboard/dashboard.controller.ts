import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

const getAdminDashboard = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const result = await DashboardService.getAdminDashboard();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin dashboard data fetched successfully',
      data: result,
    });
  }
);

const getGuideDashboard = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const userId = req.user?.id as string;
    const result = await DashboardService.getGuideDashboard(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Guide dashboard data fetched successfully',
      data: result,
    });
  }
);

const getTouristDashboard = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const userId = req.user?.id as string;
    const result = await DashboardService.getTouristDashboard(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tourist dashboard data fetched successfully',
      data: result,
    });
  }
);

export const DashboardController = {
  getAdminDashboard,
  getGuideDashboard,
  getTouristDashboard,
};
