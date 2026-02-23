import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { IAuthUser } from '../../interfaces/common';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { tourFilterableFields } from './tour.constant';
import { TourService } from './tour.service';

const createTour = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const payload = {
      ...req.body,
      imageURL: req.file?.path,
    };

    console.log('USER', req.user);

    const result = await TourService.createTour(
      req.user as JwtPayload,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Tour created successfully',
      data: result,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const guideId = req.user?.id;
    const tourId = req.params.id;

    const payload = {
      ...req.body,
      imageURL: req.file?.path,
    };

    const result = await TourService.updateTour(
      tourId,
      guideId as string,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Tour updated successfully',
      data: result,
    });
  }
);

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, tourFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await TourService.getAllTours(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tours data fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getTourById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.getTourById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour retrieval successfully',
    data: result,
  });
});

const deleteTourById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTourById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour deleted successfully',
    data: result,
  });
});

export const TourController = {
  createTour,
  updateTour,
  getAllTours,
  getTourById,
  deleteTourById,
};
