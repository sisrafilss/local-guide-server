import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import { CreateTouristInput } from './user.interface';

const createTourist = async (payload: CreateTouristInput) => {
  const { email, password, name, profilePicUrl, bio } = payload;

  // Check if email already exists
  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
  }

  console.log('PAYLOAD', payload);

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

export const UserService = {
  createTourist,
};
