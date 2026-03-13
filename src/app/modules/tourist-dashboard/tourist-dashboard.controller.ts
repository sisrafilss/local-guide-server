import { BookingStatus } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { TouristDashboardService, TouristBookingFilters } from './tourist-dashboard.service';

const getMyBookings = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const userId = req.user?.id as string;
    const filters = pick(req.query, ['status', 'searchTerm', 'city', 'guideId']) as TouristBookingFilters;
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await TouristDashboardService.getMyBookings(userId, filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'My bookings fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getMyBookingById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const result = await TouristDashboardService.getMyBookingById(
      userId,
      id as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking details fetched successfully',
      data: result,
    });
  }
);

const cancelMyBooking = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const result = await TouristDashboardService.cancelMyBooking(userId, id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking cancelled successfully',
      data: result,
    });
  }
);

export const TouristDashboardController = {
  getMyBookings,
  getMyBookingById,
  cancelMyBooking,
};
