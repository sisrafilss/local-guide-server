import { Gender, UserStatus } from '@prisma/client';
import { z } from 'zod';

// -------------------- Update Admin Zod Schema --------------------
export const updateAdminZodSchema = z.object({
  // -------- User fields --------
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  address: z.string().min(2).optional(),
  gender: z.enum(Gender).optional(),
  profilePicUrl: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});
