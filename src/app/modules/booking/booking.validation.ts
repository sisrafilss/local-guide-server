import { z } from 'zod';

export const CreateBookingZodSchema = z.object({
  listingId: z.uuid({
    message: 'Invalid listingId',
  }),

  touristId: z.uuid({
    message: 'Invalid touristId',
  }),

  guideId: z.uuid({
    message: 'Invalid guideId',
  }),

  userId: z.uuid({ message: 'Invalid userId' }).optional(),

  startAt: z.iso.datetime({ message: 'startAt must be a valid ISO datetime' }),

  endAt: z.iso
    .datetime({ message: 'endAt must be a valid ISO datetime' })
    .optional(),

  totalPrice: z
    .number({
      message: 'totalPrice must be a number',
    })
    .positive('totalPrice must be greater than 0'),

  pax: z
    .number()
    .int('pax must be an integer')
    .min(1, 'pax must be at least 1')
    .optional(),

  notes: z
    .string()
    .max(500, 'notes must be less than 500 characters')
    .optional(),
});
