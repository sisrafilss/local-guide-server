import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';

const getMyBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      tourist: {
        userId: userId,
      },
    },
    orderBy: {
      createdAt: 'desc',
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
          city: true,
          images: true,
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
    },
  });

  return bookings;
};

const getMyBookingById = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
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
          images: true,
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
              phone: true,
              email: true,
            },
          },
        },
      },
      payment: {
        select: {
          id: true,
          transactionId: true,
          amount: true,
          status: true,
          createdAt: true,
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

const cancelMyBooking = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tourist: {
        userId: userId,
      },
    },
  });

  if (!booking) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Booking not found or access denied'
    );
  }

  if (booking.status !== 'PENDING') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Only pending bookings can be cancelled'
    );
  }

  const cancelledBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      totalPrice: true,
    },
  });

  return cancelledBooking;
};

export const TouristDashboardService = {
  getMyBookings,
  getMyBookingById,
  cancelMyBooking,
};
