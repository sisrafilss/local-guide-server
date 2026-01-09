import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IPaginationOptions } from '../../interfaces/pagination';
import { prisma } from '../../shared/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { bookingSearchableFields } from './booking.constant';
import {
  CreateBookingPayload,
  GetAllBookingsParams,
  UpdateBookingPayload,
} from './booking.interface';

const createBooking = async (payload: CreateBookingPayload) => {
  const {
    listingId,
    touristId,
    guideId,
    userId,
    startAt,
    endAt,
    totalPrice,
    pax = 1,
    notes,
  } = payload;

  const booking = await prisma.booking.create({
    data: {
      listingId,
      touristId,
      guideId,
      userId,
      startAt,
      endAt,
      totalPrice,
      pax,
      notes,
      // status will default to PENDING
    },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      totalPrice: true,
      pax: true,
      listing: {
        select: {
          id: true,
          title: true,
        },
      },
      guide: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      tourist: {
        select: {
          id: true,
        },
      },
      createdAt: true,
    },
  });

  return booking;
};

const getAllBookings = async (
  userId: string,
  params: GetAllBookingsParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.BookingWhereInput[] = [];

  // 🔐 USER-SPECIFIC CONDITION (CORE PART)
  andConditions.push({
    OR: [
      {
        tourist: {
          userId: userId,
        },
      },
      {
        guide: {
          user: {
            id: userId,
          },
        },
      },
    ],
  });

  // 🔍 Search (excluding enum fields)
  if (searchTerm) {
    andConditions.push({
      OR: bookingSearchableFields
        .filter((field) => field !== 'status')
        .map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
    });
  }

  // 🎯 Filters
  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: filterData[key as keyof typeof filterData],
      })),
    });
  }

  const whereConditions: Prisma.BookingWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      totalPrice: true,
      pax: true,
      notes: true,
      createdAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          city: true,
        },
      },
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
      tourist: {
        select: {
          id: true,
        },
      },
    },
  });

  const total = await prisma.booking.count({
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

const getBookingById = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      OR: [
        {
          tourist: {
            userId: userId,
          },
        },
        {
          guide: {
            user: {
              id: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      totalPrice: true,
      pax: true,
      notes: true,
      createdAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          description: true,
          city: true,
          meetingPoint: true,
        },
      },
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
      tourist: {
        select: {
          id: true,
        },
      },
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          // method: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Booking not found or access denied'
    );
  }

  return booking;
};

const deleteBookingById = async (userId: string, id: string) => {
  // find booking
  const booking = await prisma.booking.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  // ownership check
  if (booking.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this booking'
    );
  }

  // delete booking
  const deletedBooking = await prisma.booking.delete({
    where: { id },
  });

  return deletedBooking;
};

const updateBookingById = async (
  bookingId: string,
  userId: string,
  payload: UpdateBookingPayload
) => {
  // 1. find booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  // 2. ownership check
  if (booking.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this booking'
    );
  }

  // 3. update booking
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: payload,
  });

  return updatedBooking;
};

const getBookingStatsForTourist = async (userId: string) => {
  // Current date for comparison
  const now = new Date();

  // Fetch all bookings for this tourist
  const bookings = await prisma.booking.findMany({
    where: {
      tourist: {
        userId: userId,
      },
    },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      totalPrice: true,
    },
  });

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter((b) => b.startAt > now).length;
  const pastBookings = bookings.filter((b) => b.endAt && b.endAt < now).length;
  const totalSpent = bookings.reduce(
    (acc, b) => acc + b.totalPrice.toNumber(),
    0
  );

  // Count bookings by status
  const statusCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });

  return {
    totalBookings,
    upcomingBookings,
    pastBookings,
    totalSpent,
    statusCounts,
  };
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBookingById,
  updateBookingById,
  getBookingStatsForTourist,
};
