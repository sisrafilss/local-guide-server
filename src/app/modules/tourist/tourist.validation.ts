import { z } from 'zod';

export const updateTouristZodSchema = z
  .object({
    preferences: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  })
  .refine((data) => data.preferences || data.name || data.bio, {
    message: 'At least one field must be provided for update',
  });
export type UpdateTouristSchema = z.infer<typeof updateTouristZodSchema>;
