import { Gender, Prisma, UserStatus } from '@prisma/client';

export type GetAllGuideParams = {
  searchTerm?: string;
  status?: string;
};

export type UpdateGuidePayload = {
  /** -------- User table fields -------- */
  name?: string;
  phone?: string;
  address?: string;
  gender?: Gender;
  profilePicUrl?: string | null;
  bio?: string | null;
  status?: UserStatus; // optional but common in admin updates

  /** -------- Guide table fields -------- */
  expertise?: string[];
  dailyRate?: Prisma.Decimal | number | string;
  verificationStatus?: boolean;
};
