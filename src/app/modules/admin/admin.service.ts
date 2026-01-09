import { Prisma, UserRole, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { prisma } from '../../shared/prisma';
import { calculatePagination } from '../../utils/calculatePagination';
import { GetAllTouristsParams } from '../tourist/tourist.interface';
import { IPaginationOptions } from '../user/user.interface';
import { UpdateAdmin } from './admin.interface';

// -------------------- GET ALL ADMINS --------------------
const getAllAdmins = async (
  params: GetAllTouristsParams,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  // 🔍 Search by name/email
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  // 🎯 Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    });
  }

  // Only admins
  andConditions.push({ role: UserRole.ADMIN });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 📦 Query data
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
  });

  // 🔢 Total count
  const total = await prisma.user.count({ where: whereConditions });

  // Flatten for consistency (no nested structure)
  const flattenedResult = result.map((user) => ({
    ...user,
  }));

  return {
    meta: { page, limit, total },
    data: flattenedResult,
  };
};

// -------------------- GET SINGLE ADMIN --------------------
const getSingleAdminById = async (adminId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  return admin;
};

// -------------------- UPDATE ADMIN --------------------
const updateAdminById = async (
  adminId: string,
  payload: UpdateAdmin,
  authUser: JwtPayload
) => {
  // 1. Check if admin exists
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // 2. Authorization check: only admin can update
  if (authUser.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to update this admin'
    );
  }

  const updatedAdmin = await prisma.user.update({
    where: { id: adminId },
    data: payload,
  });

  return updatedAdmin;
};

// -------------------- DELETE ADMIN --------------------
const deleteAdminById = async (adminId: string, authUser: JwtPayload) => {
  // 1. Check if admin exists
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // 2. Authorization check: only super-admin/admin can delete
  if (authUser.role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not allowed to delete this admin'
    );
  }

  await prisma.user.delete({ where: { id: adminId } });

  return { message: 'Admin deleted successfully' };
};

interface IGuideStats {
  totalGuides: number;
  verifiedGuides: number;
  unverifiedGuides: number;
  averageDailyRate: number;
  expertiseBreakdown: Record<string, number>;
  recentGuides: Array<{
    id: string;
    name: string;
    email: string;
    dailyRate: number;
    expertise: string | null;
    verificationStatus: string;
  }>;
}

interface ITouristStats {
  totalTourists: number;
  activeTourists: number;
  inactiveTourists: number;
  recentTourists: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
  }>;
}

interface IAdminStats {
  guideStats: IGuideStats;
  touristStats: ITouristStats;
  totalUsers: number;
}

export const getStats = async (role: UserRole, userId?: string) => {
  // -----------------------------
  // ADMIN DASHBOARD STATS
  // -----------------------------
  if (role === UserRole.ADMIN) {
    // 1️⃣ Total guides
    const totalGuides = await prisma.guide.count();

    // 2️⃣ Verified / Unverified guides
    const verifiedGuides = await prisma.guide.count({
      where: { verificationStatus: true },
    });
    const unverifiedGuides = totalGuides - verifiedGuides;

    // 3️⃣ Average daily rate
    const avgDailyRateResult = await prisma.guide.aggregate({
      _avg: { dailyRate: true },
    });
    const averageDailyRate = Number(avgDailyRateResult._avg.dailyRate ?? 0);

    // 4️⃣ Expertise breakdown
    const expertiseGroups = await prisma.guide.groupBy({
      by: ['expertise'],
      _count: { id: true },
    });
    const expertiseBreakdown: Record<string, number> = {};
    expertiseGroups.forEach((group) => {
      const key =
        (Array.isArray(group.expertise)
          ? group.expertise[0]
          : group.expertise) ?? 'Unknown';
      expertiseBreakdown[key] = group._count.id;
    });

    // 5️⃣ Recent guides (last 5)
    const recentGuides = await prisma.guide.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedRecentGuides = recentGuides.map((g) => ({
      id: g.id,
      name: g.user.name,
      email: g.user.email,
      dailyRate: Number(g.dailyRate),
      expertise: Array.isArray(g.expertise)
        ? g.expertise[0] ?? null
        : g.expertise,
      verificationStatus: g.verificationStatus ? 'VERIFIED' : 'UNVERIFIED',
    }));

    // 6️⃣ Total tourists
    const totalTourists = await prisma.tourist.count();
    const activeTourists = await prisma.tourist.count({
      where: { user: { status: UserStatus.ACTIVE } },
    });
    const inactiveTourists = totalTourists - activeTourists;

    const recentTouristsRaw = await prisma.tourist.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, status: true } },
      },
    });

    const recentTourists = recentTouristsRaw.map((t) => ({
      id: t.id,
      name: t.user.name,
      email: t.user.email,
      status: t.user.status,
    }));

    const adminStats: IAdminStats = {
      guideStats: {
        totalGuides,
        verifiedGuides,
        unverifiedGuides,
        averageDailyRate,
        expertiseBreakdown,
        recentGuides: formattedRecentGuides,
      },
      touristStats: {
        totalTourists,
        activeTourists,
        inactiveTourists,
        recentTourists,
      },
      totalUsers: totalGuides + totalTourists,
    };

    return adminStats;
  }

  // -----------------------------
  // GUIDE DASHBOARD STATS
  // -----------------------------
  if (role === UserRole.GUIDE && userId) {
    // 1️⃣ Total bookings for this guide
    const totalBookings = await prisma.booking.count({
      where: { guideId: userId },
    });

    // // 2️⃣ Upcoming bookings
    // const upcomingBookings = await prisma.booking.count({
    //   where: { guideId: userId, date: { gte: new Date() } },
    // });

    // 3️⃣ Completed bookings
    const completedBookings = await prisma.booking.count({
      where: { guideId: userId, status: 'COMPLETED' },
    });

    // // 4️⃣ Average rating for this guide
    // const avgRatingResult = await prisma.review.aggregate({
    //   where: { guideId: userId },
    //   _avg: { rating: true },
    // });
    // const averageRating = Number(avgRatingResult._avg?.rating ?? 0);

    // 5️⃣ Latest 5 bookings
    const recentBookings = await prisma.booking.findMany({
      where: { guideId: userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        tourist: {
          select: {
            id: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    const formattedRecentBookings = recentBookings.map((b) => ({
      id: b.id,
      touristName: b.tourist.user.name,
      touristEmail: b.tourist.user.email,
      // date: b.bookingDate,
      status: b.status,
    }));

    return {
      totalBookings,
      // upcomingBookings,
      completedBookings,
      // averageRating,
      recentBookings: formattedRecentBookings,
    };
  }

  // -----------------------------
  // TOURIST DASHBOARD STATS
  // -----------------------------
  if (role === UserRole.TOURIST && userId) {
    // 1️⃣ Total bookings by this tourist
    const totalBookings = await prisma.booking.count({
      where: { touristId: userId },
    });

    // // 2️⃣ Upcoming bookings
    // const upcomingBookings = await prisma.booking.count({
    //   where: { touristId: userId, date: { gte: new Date() } },
    // });

    // 3️⃣ Completed bookings
    const completedBookings = await prisma.booking.count({
      where: { touristId: userId, status: 'COMPLETED' },
    });

    // 4️⃣ Latest 5 bookings
    const recentBookings = await prisma.booking.findMany({
      where: { touristId: userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        guide: {
          select: {
            id: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    const formattedRecentBookings = recentBookings.map((b) => ({
      id: b.id,
      guideName: b.guide.user.name,
      guideEmail: b.guide.user.email,
      // date: b.bookingDate,
      status: b.status,
    }));

    return {
      totalBookings,
      // upcomingBookings,
      completedBookings,
      recentBookings: formattedRecentBookings,
    };
  }

  throw new Error('Invalid role or missing userId for stats');
};

// -------------------- EXPORT --------------------
export const AdminService = {
  getAllAdmins,
  getSingleAdminById,
  updateAdminById,
  deleteAdminById,
  getStats,
};
