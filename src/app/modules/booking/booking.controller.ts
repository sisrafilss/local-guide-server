import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { bookingSearchableFields } from './booking.constant';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    images: req.file?.path,
  };

  const result = await BookingService.createBooking(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const filters = pick(req.query, bookingSearchableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await BookingService.getAllBookings(
      req.user?.id,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bookings data fetched!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getBookingById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;
    const result = await BookingService.getBookingById(
      req?.user?.id as string,
      id
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tour retrieval successfully',
      data: result,
    });
  }
);

const deleteBookingById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;
    await BookingService.deleteBookingById(req?.user?.id as string, id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking deleted successfully',
      data: undefined,
    });
  }
);

const updateBookingById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;
    const payload = {
      ...req.body,
    };

    const result = await BookingService.updateBookingById(
      id,
      req?.user?.id as string,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking updated successfully',
      data: result,
    });
  }
);

export const BookingController = {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBookingById,
  updateBookingById,
};
