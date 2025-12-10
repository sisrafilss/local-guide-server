import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../../shared/prisma';
import { CreateTouristInput } from './user.interface';

const createTourist = async (payload: CreateTouristInput) => {
  const { email, password, name, profilePicUrl, bio } = payload;

  // Check if email already exists
  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

    return {
      user,
    };
  });
};

export const UserService = {
  createTourist,
};
