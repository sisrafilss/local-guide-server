import z from 'zod';

export const TourCategoryEnm = z.enum([
  'FOOD',
  'HISTORY',
  'PHOTOGRAPHY',
  'ADVENTURE',
  'NIGHTLIFE',
  'SHOPPING',
  'CUSTOM',
]);

export const CreateTourZodSchema = z.object({
  id: z.uuid().optional(),

  title: z.string().min(5, 'Title must be at least 5 characters').max(120),

  description: z.string().min(20, 'Description must be at least 20 characters'),

  itinerary: z.string().optional(),

  price: z.coerce.number().positive('Price must be greater than 0').max(100000),

  durationMin: z.coerce.number().int().positive('Duration must be positive'),

  meetingPoint: z.string().min(3, 'Meeting point is required'),

  maxGroupSize: z.coerce.number().int().min(1).max(50).default(1),

  category: TourCategoryEnm.optional().default('CUSTOM'),

  city: z.string().min(2, 'City name is required'),

  lat: z.coerce.number().min(-90).max(90).optional(),

  lng: z.coerce.number().min(-180).max(180).optional(),

  imageURL: z.string().optional(),

  active: z.boolean().optional().default(true),
});

export const UpdateTourZodSchema = z.object({
  title: z.string().min(5).max(120).optional(),

  description: z.string().min(20).optional(),

  itinerary: z.string().optional(),

  price: z.coerce.number().positive().max(100000).optional(),

  durationMin: z.coerce.number().int().positive().optional(),

  meetingPoint: z.string().min(3).optional(),

  maxGroupSize: z.coerce.number().int().min(1).max(50).optional(),

  category: TourCategoryEnm.optional(),

  city: z.string().min(2).optional(),

  lat: z.coerce.number().min(-90).max(90).optional(),

  lng: z.coerce.number().min(-180).max(180).optional(),

  imageURL: z.string().optional(),

  active: z.boolean().optional(),
});

export type CreateTourInput = z.infer<typeof CreateTourZodSchema>;
export type UpdateTourInput = z.infer<typeof UpdateTourZodSchema>;
