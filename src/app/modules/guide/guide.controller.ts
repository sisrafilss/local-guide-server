import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { guidesFilterableFields } from './guide.constant';
import { GuideService } from './guide.service';

const getAllGuides = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const filters = pick(req.query, guidesFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await GuideService.getAllGuides(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Guides data fetched!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getGuideStats = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const result = await GuideService.getGuideStats();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Guide Stats data fetched!',
      data: result,
    });
  }
);
const getSingleGuideById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;

    const result = await GuideService.getSingleGuideById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Guide data fetched!',
      data: result,
    });
  }
);

const updateGuideById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const payload = {
      ...req.body,
      profilePicUrl: req.file?.path,
    };
    const { id } = req.params;

    const result = await GuideService.updateGuideById(
      id,
      payload,
      req.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Guide updated successfully',
      data: result,
    });
  }
);

const deleteGuidetById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    console.log('DELETE GUIDE API HIT');

    const { id } = req.params;
    const result = await GuideService.deleteGuidetById(
      id,
      req.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Guide Deleted Successfully!',
      data: result,
    });
  }
);

export const GuideController = {
  getAllGuides,
  getSingleGuideById,
  deleteGuidetById,
  updateGuideById,
  getGuideStats,
};
