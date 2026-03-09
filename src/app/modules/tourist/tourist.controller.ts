import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { touristFilterableFields } from './tourist.constant';
import { TouristService } from './tourist.service';

const getSingleTouristById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;

    const result = await TouristService.getSingleTouristById(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tourist data fetched!',
      data: result,
    });
  }
);

const getAllTourists = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const filters = pick(req.query, touristFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await TouristService.getAllTourists(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tourists data fetched!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateTouristById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const payload = {
      ...req.body,
      profilePicUrl: req.file?.path,
    };
    const { id } = req.params;

    const result = await TouristService.updateTouristById(
      id as string,
      payload,
      req.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tourist updated successfully',
      data: result,
    });
  }
);

const deleteTouristById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;

    const result = await TouristService.deleteTouristById(
      id as string,
      req.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Tourist deleted successfully',
      data: result,
    });
  }
);

export const TouristController = {
  deleteTouristById,
  getAllTourists,
  getSingleTouristById,
  updateTouristById,
};
