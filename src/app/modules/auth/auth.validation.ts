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
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
