import { UserRole, UserStatus, BookingStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';

const getAdminDashboard = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalUsers,
    totalGuides,
    totalTourists,
    totalBookings,
    totalListings,
    verifiedGuides,
    unverifiedGuides,
    activeTourists,
    activeListings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.guide.count(),
    prisma.tourist.count(),
    prisma.booking.count(),
    prisma.listing.count(),
    prisma.guide.count({ where: { verificationStatus: true } }),
    prisma.guide.count({ where: { verificationStatus: false } }),
    prisma.tourist.count({ where: { user: { status: UserStatus.ACTIVE } } }),
    prisma.listing.count({ where: { active: true } }),
  ]);

  const monthlyBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  const lastMonthBookings = await prisma.booking.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  const recentBookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { select: { id: true, title: true, city: true } },
      tourist: {
        select: {
          id: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
      guide: {
        select: {
          id: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const bookingsByStatus = await prisma.booking.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const bookingsByStatusObj = bookingsByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    },
    {} as Record<string, number>
  );

  const avgDailyRateResult = await prisma.guide.aggregate({
    _avg: { dailyRate: true },
  });

  const totalRevenueResult = await prisma.booking.aggregate({
    where: { status: BookingStatus.COMPLETED },
    _sum: { totalPrice: true },
  });

  return {
    overview: {
      totalUsers,
      totalGuides,
      totalTourists,
      totalBookings,
      totalListings,
      verifiedGuides,
      unverifiedGuides,
      activeTourists,
      activeListings,
    },
    monthlyStats: {
      monthlyBookings,
      lastMonthBookings,
      growth:
        lastMonthBookings > 0
          ? ((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100
          : 0,
    },
    financials: {
      averageDailyRate: Number(avgDailyRateResult._avg.dailyRate || 0),
      totalRevenue: Number(totalRevenueResult._sum.totalPrice || 0),
    },
    bookingsByStatus: bookingsByStatusObj,
    recentBookings: recentBookings.map((b) => ({
      id: b.id,
      status: b.status,
      totalPrice: Number(b.totalPrice),
      startAt: b.startAt,
      listingTitle: b.listing.title,
      listingCity: b.listing.city,
      touristName: b.tourist.user.name,
      touristEmail: b.tourist.user.email,
      guideName: b.guide.user.name,
      createdAt: b.createdAt,
    })),
    recentUsers: recentUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    })),
  };
};

const getGuideDashboard = async (userId: string) => {
  const guide = await prisma.guide.findFirst({
    where: { userId },
  });

  if (!guide) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Guide profile not found');
  }

  const guideId = guide.id;
  const now = new Date();

  const [
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalListings,
    activeListings,
    totalEarnings,
  ] = await Promise.all([
    prisma.booking.count({ where: { guideId } }),
    prisma.booking.count({ where: { guideId, status: BookingStatus.COMPLETED } }),
    prisma.booking.count({ where: { guideId, status: BookingStatus.PENDING } }),
    prisma.booking.count({ where: { guideId, status: BookingStatus.CANCELLED } }),
    prisma.listing.count({ where: { guideId } }),
    prisma.listing.count({ where: { guideId, active: true } }),
    prisma.booking.aggregate({
      where: { guideId, status: BookingStatus.COMPLETED },
      _sum: { totalPrice: true },
    }),
  ]);

  const upcomingBookings = await prisma.booking.findMany({
    where: {
      guideId,
      startAt: { gte: now },
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
    take: 10,
    orderBy: { startAt: 'asc' },
    include: {
      listing: { select: { id: true, title: true, city: true } },
      tourist: {
        select: {
          id: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
  });

  const recentBookings = await prisma.booking.findMany({
    where: { guideId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { select: { id: true, title: true, city: true } },
      tourist: {
        select: {
          id: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  const monthlyEarnings = await prisma.booking.aggregate({
    where: {
      guideId,
      status: BookingStatus.COMPLETED,
      createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
    },
    _sum: { totalPrice: true },
  });

  const lastMonthEarnings = await prisma.booking.aggregate({
    where: {
      guideId,
      status: BookingStatus.COMPLETED,
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        lt: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    },
    _sum: { totalPrice: true },
  });

  const bookingsByStatus = await prisma.booking.groupBy({
    by: ['status'],
    where: { guideId },
    _count: { id: true },
  });

  const bookingsByStatusObj = bookingsByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    },
    {} as Record<string, number>
  );

  const reviews = await prisma.review.findMany({
    where: {
      booking: { guideId },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      reviewer: { select: { id: true, name: true, profilePicUrl: true } },
      listing: { select: { id: true, title: true } },
    },
  });

  return {
    overview: {
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalListings,
      activeListings,
      verificationStatus: guide.verificationStatus,
    },
    earnings: {
      totalEarnings: Number(totalEarnings._sum.totalPrice || 0),
      monthlyEarnings: Number(monthlyEarnings._sum.totalPrice || 0),
      lastMonthEarnings: Number(lastMonthEarnings._sum.totalPrice || 0),
    },
    bookingsByStatus: bookingsByStatusObj,
    upcomingBookings: upcomingBookings.map((b) => ({
      id: b.id,
      status: b.status,
      startAt: b.startAt,
      endAt: b.endAt,
      totalPrice: Number(b.totalPrice),
      listingTitle: b.listing.title,
      listingCity: b.listing.city,
      touristName: b.tourist.user.name,
      touristEmail: b.tourist.user.email,
      touristPhone: b.tourist.user.phone,
    })),
    recentBookings: recentBookings.map((b) => ({
      id: b.id,
      status: b.status,
      startAt: b.startAt,
      totalPrice: Number(b.totalPrice),
      listingTitle: b.listing.title,
      listingCity: b.listing.city,
      touristName: b.tourist.user.name,
      createdAt: b.createdAt,
    })),
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      reviewerName: r.reviewer.name,
      reviewerProfilePic: r.reviewer.profilePicUrl,
      listingTitle: r.listing?.title,
      createdAt: r.createdAt,
    })),
  };
};

const getTouristDashboard = async (userId: string) => {
  const tourist = await prisma.tourist.findFirst({
    where: { userId },
  });

  if (!tourist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tourist profile not found');
  }

  const touristId = tourist.id;
  const now = new Date();

  const [
    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalSpent,
  ] = await Promise.all([
    prisma.booking.count({ where: { touristId } }),
    prisma.booking.count({ where: { touristId, status: BookingStatus.COMPLETED } }),
    prisma.booking.count({ where: { touristId, status: BookingStatus.PENDING } }),
    prisma.booking.count({ where: { touristId, status: BookingStatus.CANCELLED } }),
    prisma.booking.aggregate({
      where: { touristId, status: BookingStatus.COMPLETED },
      _sum: { totalPrice: true },
    }),
  ]);

  const upcomingBookings = await prisma.booking.findMany({
    where: {
      touristId,
      startAt: { gte: now },
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
    take: 10,
    orderBy: { startAt: 'asc' },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          city: true,
          meetingPoint: true,
          price: true,
          images: { take: 1, select: { url: true } },
        },
      },
      guide: {
        select: {
          id: true,
          user: { select: { id: true, name: true, profilePicUrl: true } },
        },
      },
    },
  });

  const recentBookings = await prisma.booking.findMany({
    where: { touristId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { select: { id: true, title: true, city: true } },
      guide: {
        select: {
          id: true,
          user: { select: { id: true, name: true, profilePicUrl: true } },
        },
      },
      payment: { select: { status: true, transactionId: true } },
    },
  });

  const monthlySpent = await prisma.booking.aggregate({
    where: {
      touristId,
      status: BookingStatus.COMPLETED,
      createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
    },
    _sum: { totalPrice: true },
  });

  const lastMonthSpent = await prisma.booking.aggregate({
    where: {
      touristId,
      status: BookingStatus.COMPLETED,
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        lt: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    },
    _sum: { totalPrice: true },
  });

  const bookingsByStatus = await prisma.booking.groupBy({
    by: ['status'],
    where: { touristId },
    _count: { id: true },
  });

  const bookingsByStatusObj = bookingsByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    },
    {} as Record<string, number>
  );

  const myReviews = await prisma.review.findMany({
    where: {
      booking: { touristId },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { select: { id: true, title: true } },
    },
  });

  return {
    overview: {
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
    },
    spending: {
      totalSpent: Number(totalSpent._sum.totalPrice || 0),
      monthlySpent: Number(monthlySpent._sum.totalPrice || 0),
      lastMonthSpent: Number(lastMonthSpent._sum.totalPrice || 0),
    },
    bookingsByStatus: bookingsByStatusObj,
    upcomingBookings: upcomingBookings.map((b) => ({
      id: b.id,
      status: b.status,
      startAt: b.startAt,
      endAt: b.endAt,
      totalPrice: Number(b.totalPrice),
      listing: {
        id: b.listing.id,
        title: b.listing.title,
        city: b.listing.city,
        meetingPoint: b.listing.meetingPoint,
        price: Number(b.listing.price),
        imageUrl: b.listing.images[0]?.url,
      },
      guide: {
        id: b.guide.id,
        name: b.guide.user.name,
        profilePicUrl: b.guide.user.profilePicUrl,
      },
    })),
    recentBookings: recentBookings.map((b) => ({
      id: b.id,
      status: b.status,
      startAt: b.startAt,
      totalPrice: Number(b.totalPrice),
      listingTitle: b.listing.title,
      listingCity: b.listing.city,
      guideName: b.guide.user.name,
      guideProfilePic: b.guide.user.profilePicUrl,
      paymentStatus: b.payment?.status,
      createdAt: b.createdAt,
    })),
    myReviews: myReviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      listingTitle: r.listing?.title,
      createdAt: r.createdAt,
    })),
  };
};

export const DashboardService = {
  getAdminDashboard,
  getGuideDashboard,
  getTouristDashboard,
};
