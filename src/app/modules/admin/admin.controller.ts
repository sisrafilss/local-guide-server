import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import { GetAllTouristsParams } from '../tourist/tourist.interface';
import { adminsFilterableFields } from './admin.constant';
import { AdminService } from './admin.service';

// -------------------- GET ALL ADMINS --------------------
const getAllAdmins = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const filters: GetAllTouristsParams = pick(
      req.query,
      adminsFilterableFields
    );
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AdminService.getAllAdmins(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admins data fetched!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// -------------------- GET SINGLE ADMIN --------------------
const getSingleAdminById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.getSingleAdminById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin data fetched!',
      data: result,
    });
  }
);

// -------------------- UPDATE ADMIN --------------------
const updateAdminById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const payload = {
      ...req.body,
      profilePicUrl: req.file?.path, // if admins can upload profile pictures
    };
    const { id } = req.params;

    const result = await AdminService.updateAdminById(
      id,
      payload,
      req.user as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin updated successfully',
      data: result,
    });
  }
);

// -------------------- DELETE ADMIN --------------------
const deleteAdminById = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id } = req.params;

    const result = await AdminService.deleteAdminById(
      id,
      req.user as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin deleted successfully',
      data: result,
    });
  }
);

const getStats = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const { id, role } = req.user as JwtPayload;

    const result = await AdminService.getStats(role, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Stats Get successfully',
      data: result,
    });
  }
);

export const AdminController = {
  getAllAdmins,
  getSingleAdminById,
  updateAdminById,
  deleteAdminById,
  getStats,
};
