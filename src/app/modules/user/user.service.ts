import { Prisma, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import { IPaginationOptions } from '../../interfaces/pagination';
import { prisma } from '../../shared/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { userSearchAbleFields } from './user.constant';
import {
  CreateAdminInput,
  CreateGuideInput,
  CreateTouristInput,
} from './user.interface';

const createTourist = async (payload: CreateTouristInput) => {
  const { email, password, name, profilePicUrl, bio, address, phone, gender } =
    payload;

  // Check if email already exists
  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.salt_round));

  return await prisma.$transaction(async (tx) => {
    // Create User
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profilePicUrl,
        bio,
        role: UserRole.TOURIST,
        address,
        phone,
        gender,
      },
    });

    const tourst = await tx.tourist.create({
      data: {
        userId: user.id,
      },
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicUrl: user.profilePicUrl,
      bio: user.bio,
      id: user.id,
      touristId: tourst.id,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
    };
  });
};

const createGuide = async (payload: CreateGuideInput) => {
  const {
    email,
    password,
    name,
    profilePicUrl,
    expertise,
    dailyRate,
    address,
    phone,
    gender,
  } = payload;

  // Check if email already exists
  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.salt_round));

  return await prisma.$transaction(async (tx) => {
    // Create User
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profilePicUrl,
        role: UserRole.GUIDE,
        address,
        phone,
        gender,
      },
    });

    const guide = await tx.guide.create({
      data: {
        userId: user.id,
        expertise,
        dailyRate,
      },
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicUrl: user.profilePicUrl,
      id: user.id,
      guideId: guide.id,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
    };
  });
};

const createAdmin = async (payload: CreateAdminInput) => {
  const { email, password, name, profilePicUrl, address, phone, gender } =
    payload;

  // Check if email already exists
  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.salt_round));

  return await prisma.$transaction(async (tx) => {
    // Create User
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profilePicUrl,
        role: UserRole.ADMIN,
        address,
        phone,
        gender,
      },
    });

    const admin = await tx.admin.create({
      data: {
        userId: user.id,
      },
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicUrl: user.profilePicUrl,
      id: user.id,
      adminId: admin.id,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
    };
  });
};

const getAllUsers = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicUrl: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      tourist: true,
      guide: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteUser = async (userId: string, authUser: JwtPayload) => {
  // 1. Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // 2. Authorization check
  const isAdmin = authUser.role === UserRole.ADMIN;
  const isSelf = authUser.id === userId;

  if (!isAdmin && !isSelf) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this user'
    );
  }

  // 3. Delete user (relations handled by cascade or manually)
  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    message: 'User deleted successfully',
  };
};

export const UserService = {
  createTourist,
  createGuide,
  createAdmin,
  getAllUsers,
  deleteUser,
};
