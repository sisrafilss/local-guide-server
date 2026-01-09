import { z } from 'zod';

export const authValidationZodSchema = z.object({
  email: z
    .email('Invalid email address')
    .refine((val) => val.length > 0, { message: 'Email is required' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordZodSchema = z.object({
  email: z
    .email('Invalid email address')
    .refine((val) => val.length > 0, { message: 'Email is required' }),
});

export const resetPasswordZodSchema = z.object({
  id: z
    .string()
    .refine((val) => val.length > 0, { message: 'User ID is required' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string('Password is required')
    .min(6, {
      error: 'Password is required and must be at least 6 characters long',
    })
    .max(100, {
      error: 'Password must be at most 100 characters long',
    }),
});
