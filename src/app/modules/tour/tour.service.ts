import { PrismaClient } from '@prisma/client';
import { CreateTourInput } from './tour.validation';

const prisma = new PrismaClient();

export const createTour = async (payload: CreateTourInput) => {
  const { guideId, images, ...listingData } = payload;

  const tour = await prisma.listing.create({
    data: {
      ...listingData,
      guideId,

      images: images?.length
        ? {
            create: images.map((url) => ({
              url,
            })),
          }
        : undefined,
    },

    include: {
      images: true,
      guide: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              profilePicUrl: true,
            },
          },
        },
      },
    },
  });

  return tour;
};

export const TourService = {
  createTour,
};
