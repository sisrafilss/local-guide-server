import { Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { GetAllTouristsParams } from '../tourist/tourist.interface';
import { IPaginationOptions } from '../user/user.interface';
import { UpdateAdmin } from './admin.interface';

// -------------------- GET ALL ADMINS --------------------
const getAllAdmins = async (
  params: GetAllTouristsParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  // 🔍 Search by name/email
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  // 🎯 Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    });
  }

  // Only admins
  andConditions.push({ role: UserRole.ADMIN });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 📦 Query data
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
  });

  // 🔢 Total count
  const total = await prisma.user.count({ where: whereConditions });

  // Flatten for consistency (no nested structure)
  const flattenedResult = result.map((user) => ({
    ...user,
  }));

  return {
    meta: { page, limit, total },
    data: flattenedResult,
  };
};

// -------------------- GET SINGLE ADMIN --------------------
const getSingleAdminById = async (adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  return admin;
};

// -------------------- UPDATE ADMIN --------------------
const updateAdminById = async (
  adminId: string,
  payload: UpdateAdmin,
  authUser: JwtPayload
) => {
  // 1. Check if admin exists
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // 2. Authorization check: only admin can update
  if (authUser.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to update this admin'
    );
  }

  const updatedAdmin = await prisma.user.update({
    where: { id: adminId },
    data: payload,
  });

  return updatedAdmin;
};

// -------------------- DELETE ADMIN --------------------
const deleteAdminById = async (adminId: string, authUser: JwtPayload) => {
  // 1. Check if admin exists
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // 2. Authorization check: only super-admin/admin can delete
  if (authUser.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this admin'
    );
  }

  await prisma.user.delete({ where: { id: adminId } });

  return { message: 'Admin deleted successfully' };
};

// -------------------- EXPORT --------------------
export const AdminService = {
  getAllAdmins,
  getSingleAdminById,
  updateAdminById,
  deleteAdminById,
};
