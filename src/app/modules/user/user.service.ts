import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import {
  CreateAdminInput,
  CreateGuideInput,
  CreateTouristInput,
} from './user.interface';

const createTourist = async (payload: CreateTouristInput) => {
  const { email, password, name, profilePicUrl, bio } = payload;

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
    };
  });
};

const createGuide = async (payload: CreateGuideInput) => {
  const { email, password, name, profilePicUrl, expertise, dailyRate } =
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
        role: UserRole.GUIDE,
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
    };
  });
};

const createAdmin = async (payload: CreateAdminInput) => {
  const { email, password, name, profilePicUrl } = payload;

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
    };
  });
};

export const UserService = {
  createTourist,
  createGuide,
  createAdmin,
};
