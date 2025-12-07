import { Request } from 'express';
import { prisma } from '../../shared/prisma';

const createPatient = async (req: Request) => {
  const userData = req.body;

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: userData.password,
    },
  });

  return user;
};

export const UserService = {
  createPatient,
};
