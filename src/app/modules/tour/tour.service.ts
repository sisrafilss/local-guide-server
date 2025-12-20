import { Listing, Prisma, PrismaClient, UserStatus } from '@prisma/client';
import { IPaginationOptions } from '../../interfaces/pagination';
import { calculatePagination } from '../../utils/calculatePagination';
import { tourSearchableFields } from './tour.constant';
import { GetAllToursParams } from './tour.interface';
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

const getAllTours = async (
  params: GetAllToursParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ListingWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: tourSearchableFields.map((filed) => ({
        [filed]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: filterData[key as keyof typeof filterData],
      })),
    });
  }

  const whereConditions: Prisma.ListingWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.listing.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      durationMin: true,
      meetingPoint: true,
      maxGroupSize: true,
      category: true,
      city: true,
      lat: true,
      lng: true,
      active: true,
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

  const total = await prisma.listing.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getTourById = async (id: string): Promise<Listing | null> => {
  const result = await prisma.listing.findUnique({
    where: {
      id,
    },
    include: {
      guide: true,
    },
  });
  return result;
};

const deleteTourById = async (id: string): Promise<Listing> => {
  const result = await prisma.listing.delete({
    where: {
      id,
    },
  });
  return result;
};

export const TourService = {
  createTour,
  updateTour,
  getAllTours,
  getTourById,
  deleteTourById,
};
