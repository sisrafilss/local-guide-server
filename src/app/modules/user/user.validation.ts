import { z } from 'zod';

export const createTouristSchema = z.object({
  email: z.email('Invalid email'),

  password: z.string().min(6, 'Password must be at least 6 characters'),

  name: z.string().min(2, 'Name must be at least 2 characters'),

  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),

  address: z.string().min(5, 'Address must be at least 5 characters'),

  phone: z
    .string()
    .regex(/^(\+?\d{1,4}[\s-]?)?(\d{10,15})$/, 'Invalid phone number')
    .optional(),

  gender: z.enum(['MALE', 'FEMALE']).optional(),
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
  address: z.string().min(5, 'Address must be at least 5 characters'),

  phone: z
    .string()
    .regex(/^(\+?\d{1,4}[\s-]?)?(\d{10,15})$/, 'Invalid phone number')
    .optional(),

  gender: z.enum(['MALE', 'FEMALE']).optional(),

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
  address: z.string().min(5, 'Address must be at least 5 characters'),

  phone: z
    .string()
    .regex(/^(\+?\d{1,4}[\s-]?)?(\d{10,15})$/, 'Invalid phone number')
    .optional(),

  gender: z.enum(['MALE', 'FEMALE']).optional(),
});
