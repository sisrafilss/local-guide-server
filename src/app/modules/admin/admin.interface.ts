import { Gender, UserStatus } from '@prisma/client';

export type UpdateAdmin = {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: Gender;
  profilePicUrl: string | null;
  bio: string | null;
  status: UserStatus;
};
