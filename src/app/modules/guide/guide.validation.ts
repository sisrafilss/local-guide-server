import { Gender, UserStatus } from '@prisma/client';
import z from 'zod';

export const updateGuideZodSchema = z.object({
  /** -------- User table fields -------- */
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),

  phone: z.string().min(7, 'Phone number is too short').optional(),

  address: z
    .string()
    .min(3, 'Address must be at least 3 characters')
    .optional(),

  gender: z.enum(Gender).optional(),

  profilePicUrl: z.url('Invalid profile picture URL').nullable().optional(),

  bio: z
    .string()
    .max(500, 'Bio cannot exceed 500 characters')
    .nullable()
    .optional(),

  status: z.enum(UserStatus).optional(),

  /** -------- Guide table fields -------- */
  expertise: z.array(z.string().min(1)).optional(),

  dailyRate: z
    .union([
      z.number().positive('Daily rate must be positive'),
      z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid daily rate'),
    ])
    .optional(),

  verificationStatus: z.boolean().optional(),
});
