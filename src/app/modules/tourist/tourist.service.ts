import { Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { IPaginationOptions } from '../../interfaces/pagination';
import { prisma } from '../../shared/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { flattenTourist, flattenTourists } from '../../utils/flattenTourist';
import { GetAllTouristsParams } from './tourist.interface';

const getAllTourists = async (
  params: GetAllTouristsParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.TouristWhereInput[] = [];

  // 🔍 Search
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    });
  }

  // 🎯 Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.TouristWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 📦 Query data
  const result = await prisma.tourist.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy
      ? {
          [sortBy]: sortOrder,
        }
      : {
          createdAt: 'desc',
        },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicUrl: true,
          bio: true,
          role: true,
          status: true,
        },
      },
    },
  });

  // 🔢 Total count
  const total = await prisma.tourist.count({
    where: whereConditions,
  });

  const flattenedResult = flattenTourists(result);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: flattenedResult,
  };
};

export const getSingleTouristById = async (touristId: string) => {
  // 1. Find tourist
  const tourist = await prisma.tourist.findUnique({
    where: { id: touristId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePicUrl: true,
          bio: true,
          role: true,
          status: true,
        },
      },
    },
  });

  // 2. Not found check
  if (!tourist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tourist not found');
  }

  return flattenTourist(tourist);
};

const deleteTouristById = async (touristId: string, authUser: JwtPayload) => {
  // 1. Check if tourist exists
  const tourist = await prisma.tourist.findUnique({
    where: { id: touristId },
    select: {
      id: true,
      userId: true,
    },
  });

  console.log('TOURIST', tourist);

  if (!tourist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tourist not found');
  }

  // 2. Authorization check
  const isAdmin = authUser.role === UserRole.ADMIN;
  const isOwner = authUser.id === tourist.userId;

  if (!isAdmin && !isOwner) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this tourist'
    );
  }

  await prisma.$transaction(async (tnx) => {
    // Delete the tourist record
    await tnx.tourist.delete({
      where: { id: touristId },
    });

    // Delete the associated user record
    await tnx.user.delete({
      where: { id: tourist.userId },
    });
  });

  return {
    message: 'Tourist deleted successfully',
  };
};

export const TouristService = {
  deleteTouristById,
  getSingleTouristById,
  getAllTourists,
};
