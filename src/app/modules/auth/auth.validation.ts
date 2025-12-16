import { z } from 'zod';

export const authValidationZodSchema = z.object({
  email: z
    .email('Invalid email address')
    .refine((val) => val.length > 0, { message: 'Email is required' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
