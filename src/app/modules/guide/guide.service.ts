import { Prisma, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { flattenGuides } from '../../utils/flattenGuide';
import { GetAllTouristsParams } from '../tourist/tourist.interface';
import { IPaginationOptions } from '../user/user.interface';
import { UpdateGuidePayload } from './guide.interface';

const getAllGuides = async (
  params: GetAllTouristsParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.GuideWhereInput[] = [];

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

  const whereConditions: Prisma.GuideWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 📦 Query data
  const result = await prisma.guide.findMany({
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
          gender: true,
          phone: true,
          address: true,
        },
      },
    },
  });

  // 🔢 Total count
  const total = await prisma.guide.count({
    where: whereConditions,
  });

  const flattenedResult = flattenGuides(result);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: flattenedResult,
  };
};

const getSingleGuideById = async (guideId: string) => {
  // 1. Find Guide
  const guide = await prisma.guide.findUnique({
    where: { id: guideId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          gender: true,
          phone: true,
          address: true,
          profilePicUrl: true,
          bio: true,
          role: true,
          status: true,
        },
      },
    },
  });

  // 2. Not found check
  if (!guide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  }

  return flattenGuides([guide]);
};

const updateGuideById = async (
  guideId: string,
  payload: UpdateGuidePayload,
  authUser: JwtPayload
) => {
  // 1. Check if guide exists
  const guide = await prisma.guide.findUnique({
    where: { id: guideId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!guide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  }

  // 2. Authorization check
  const isAdmin = authUser.role === UserRole.ADMIN;
  const isOwner = authUser.id === guide.userId;

  if (!isAdmin && !isOwner) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to update this guide'
    );
  }

  // 3. Separate user & guide payload
  const { expertise, dailyRate, verificationStatus, ...userPayload } = payload;

  // 4. Execute transaction
  await prisma.$transaction(async (tx) => {
    // Update User table
    if (Object.keys(userPayload).length > 0) {
      await tx.user.update({
        where: { id: guide.userId },
        data: userPayload,
      });
    }

    // Update Guide table
    if (
      expertise !== undefined ||
      dailyRate !== undefined ||
      verificationStatus !== undefined
    ) {
      await tx.guide.update({
        where: { id: guideId },
        data: {
          expertise,
          verificationStatus,
          dailyRate:
            dailyRate !== undefined ? new Prisma.Decimal(dailyRate) : undefined,
        },
      });
    }
  });

  // 5. Return updated guide (flatten-friendly)
  const updatedGuide = await prisma.guide.findUnique({
    where: { id: guideId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          gender: true,
          profilePicUrl: true,
          bio: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!updatedGuide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found after update');
  }

  return flattenGuides([updatedGuide])[0];
};

const deleteGuidetById = async (guideId: string, authUser: JwtPayload) => {
  // 1. Check if guide exists
  const guide = await prisma.guide.findUnique({
    where: { id: guideId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!guide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Guide not found');
  }

  // 2. Authorization check
  const isAdmin = authUser.role === UserRole.ADMIN;
  const isOwner = authUser.id === guide.userId;

  if (!isAdmin && !isOwner) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this Guide'
    );
  }

  await prisma.$transaction(async (tnx) => {
    // Delete the tourist record
    await tnx.guide.delete({
      where: { id: guideId },
    });

    // Delete the associated user record
    await tnx.user.delete({
      where: { id: guide.userId },
    });
  });

  return {
    message: 'Guide deleted successfully',
  };
};

interface IGuideStats {
  totalGuides: number;
  verifiedGuides: number;
  unverifiedGuides: number;
  averageDailyRate: number;
  expertiseBreakdown: Record<string, number>;
}

const getGuideStats = async (): Promise<IGuideStats> => {
  // 1️⃣ Total guides
  const totalGuides = await prisma.guide.count();

  // 2️⃣ Verified / Unverified guides
  const verifiedGuides = await prisma.guide.count({
    where: { verificationStatus: true },
  });

  const unverifiedGuides = totalGuides - verifiedGuides;

  // 3️⃣ Average daily rate
  const avgDailyRateResult = await prisma.guide.aggregate({
    _avg: {
      dailyRate: true,
    },
  });

  const averageDailyRate = Number(avgDailyRateResult._avg.dailyRate ?? 0);

  // 4️⃣ Expertise breakdown
  const expertiseGroups = await prisma.guide.groupBy({
    by: ['expertise'],
    _count: {
      id: true,
    },
  });

  const expertiseBreakdown: Record<string, number> = {};
  expertiseGroups.forEach((group) => {
    const key = Array.isArray(group.expertise)
      ? group.expertise.join(', ')
      : group.expertise ?? 'Unknown';
    expertiseBreakdown[key] = group._count.id;
  });

  return {
    totalGuides,
    verifiedGuides,
    unverifiedGuides,
    averageDailyRate,
    expertiseBreakdown,
  };
};

export const GuideService = {
  getAllGuides,
  getSingleGuideById,
  deleteGuidetById,
  updateGuideById,
  getGuideStats,
};
