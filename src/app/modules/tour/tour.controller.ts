import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TourService } from './tour.service';

const createTour = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    images: req.file?.path,
  };

  const result = await TourService.createTour(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tour created successfully',
    data: result,
  });
});

export const TourController = {
  createTour,
};
