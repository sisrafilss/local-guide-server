import { PrismaClient, UserStatus } from '@prisma/client';
import { CreateTourInput, UpdateTourInput } from './tour.validation';

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

const updateTour = async (
  tourId: string,
  guideUserId: string,
  payload: UpdateTourInput
) => {
  console.log('GUIDE USER ID IN SERVICE', guideUserId);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: guideUserId, status: UserStatus.ACTIVE },
    select: { guide: { select: { id: true } } },
  });

  if (!user.guide) {
    throw new Error('Only guides can update tours');
  }

  // Ownership check
  await prisma.listing.findFirstOrThrow({
    where: { id: tourId, guideId: user.guide.id },
  });

  const { images, ...rest } = payload;

  const updatedTour = await prisma.listing.update({
    where: { id: tourId },
    data: {
      ...rest,
      ...(images && {
        images: {
          deleteMany: {}, // remove existing images
          create: images.map((url) => ({ url })),
        },
      }),
    },
  });

  return updatedTour;
};

export const TourService = {
  createTour,
  updateTour,
};
