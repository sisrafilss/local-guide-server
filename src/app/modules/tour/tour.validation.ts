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
  guideId: z.string(),

  title: z.string().min(5, 'Title must be at least 5 characters').max(120),

  description: z.string().min(20, 'Description must be at least 20 characters'),

  itinerary: z.string().optional(),

  price: z.number().positive('Price must be greater than 0').max(100000),

  durationMin: z.number().int().positive('Duration must be positive'),

  meetingPoint: z.string().min(3, 'Meeting point is required'),

  maxGroupSize: z.number().int().min(1).max(50).default(1),

  category: TourCategoryEnm.optional().default('CUSTOM'),

  city: z.string().min(2, 'City name is required'),

  lat: z.number().min(-90).max(90).optional(),

  lng: z.number().min(-180).max(180).optional(),

  images: z.array(z.url('Invalid image URL')).optional(),

  active: z.boolean().optional().default(true),
});

export type CreateTourInput = z.infer<typeof CreateTourZodSchema>;
