import { z } from 'zod';

export const createTouristSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),
  travelPreferences: z.string().optional(),
});

export const createGuideSchema = z.object({
  // User table fields
  email: z
    .string({ message: 'Email is required' })
    .email('Invalid email format'),

  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),

  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must be at least 2 characters'),

  // Guide table fields
  expertise: z
    .array(z.string().min(1))
    .min(1, 'At least one expertise is required')
    .optional(),

  dailyRate: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Daily rate must be a positive number',
    }),
});

export const createAdminSchema = z.object({
  // User table fields
  email: z
    .string({ message: 'Email is required' })
    .email('Invalid email format'),

  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),

  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must be at least 2 characters'),
});
