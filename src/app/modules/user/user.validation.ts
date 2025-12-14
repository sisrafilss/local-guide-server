import { z } from 'zod';

export const createTouristSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),
  travelPreferences: z.string().optional(),
});
