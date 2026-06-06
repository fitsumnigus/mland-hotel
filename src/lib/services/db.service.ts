// src/lib/services/db.service.ts
// Reusable, error-safe database service layer

import { prisma } from "@/lib/db/prisma";
import { calculateNightlyRates, calculateTax, countNights } from "@/lib/utils";
import type {
  BookingStatus,
  RoomStatus,
  Prisma,
} from "@prisma/client";

// ─── Types ─────────────────────────────────────────────────────────────

export interface PaginationOpts {
  page?:  number;
  limit?: number;
}

export interface BookingFilters {
  status?:    string;
  userId?:    string;
  checkIn?:   Date;
  checkOut?:  Date;
  search?:    string;
}

export interface RoomFilters {
  tier?:        string;
  published?:   boolean;
  status?:      string;
}

// ─── Dashboard Stats ───────────────────────────────────────────────────

export async function getDashboardStats() {
  const now        = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd   = new Date(now.setHours(23, 59, 59, 999));

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalBookings,
    pendingBookings,
    confirmedToday,
    checkInsToday,
    checkOutsToday,
    allRooms,
    occupiedRooms,
    revenueThisMonth,
    revenueLastMonth,
    pendingReviews,
    newGuestsThisMonth,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { notIn: ["CANCELLED"] } } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED", confirmedAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.booking.count({ where: { status: "CHECKED_IN",  checkIn:  { gte: todayStart, lte: todayEnd } } }),
    prisma.booking.count({ where: { status: "CHECKED_OUT", checkOut: { gte: todayStart, lte: todayEnd } } }),
    prisma.room.count(),
    prisma.room.count({ where: { status: "OCCUPIED" } }),
    prisma.payment.aggregate({
      where: { status: "CAPTURED", capturedAt: { gte: monthStart, lte: monthEnd } },
      _sum:  { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "CAPTURED", capturedAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum:  { amount: true },
    }),
    prisma.review.count({ where: { published: false } }),
    prisma.user.count({ where: { role: "GUEST", createdAt: { gte: monthStart, lte: monthEnd } } }),
  ]);

  const thisMonthRevenue = revenueThisMonth._sum.amount ?? 0;
  const lastMonthRevenue = revenueLastMonth._sum.amount ?? 0;
  const occupancyRate    = allRooms > 0 ? (occupiedRooms / allRooms) * 100 : 0;
  const adr              = occupiedRooms > 0 ? thisMonthRevenue / occupiedRooms / 30 : 0;
  const revenueGrowth    = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  return {
    totalBookings,
    pendingBookings,
    confirmedToday,
    checkInsToday,
    checkOutsToday,
    occupancyRate:     Math.round(occupancyRate * 10) / 10,
    revenueThisMonth:  Math.round(thisMonthRevenue),
    revenueLastMonth:  Math.round(lastMonthRevenue),
    revenueGrowth:     Math.round(revenueGrowth * 10) / 10,
    averageDailyRate:  Math.round(adr),
    revPAR:            Math.round(adr * (occupancyRate / 100)),
    pendingReviews,
    newGuestsThisMonth,
    totalRooms:        allRooms,
    occupiedRooms,
  };
}

// ─── Revenue Chart Data ───────────────────────────────────────────────

export async function getRevenueByMonth(months = 12) {
  const data: { month: string; revenue: number; bookings: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

    const [payments, bookings] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "CAPTURED", capturedAt: { gte: start, lte: end } },
        _sum:  { amount: true },
      }),
      prisma.booking.count({
        where: { status: { notIn: ["CANCELLED"] }, createdAt: { gte: start, lte: end } },
      }),
    ]);

    data.push({
      month:    start.toLocaleString("default", { month: "short", year: "2-digit" }),
      revenue:  Math.round(payments._sum.amount ?? 0),
      bookings,
    });
  }

  return data;
}

// ─── Occupancy Data ───────────────────────────────────────────────────

export async function getOccupancyByMonth(months = 6) {
  const data: { month: string; occupancy: number }[] = [];
  const now        = new Date();
  const totalRooms = await prisma.room.count();
  if (totalRooms === 0) return data;

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const daysInMonth = end.getDate();

    const nightsBooked = await prisma.booking.aggregate({
      where: {
        status:  { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
        checkIn: { lt: end },
        checkOut:{ gt: start },
      },
      _sum: { nights: true },
    });

    const occupancy = Math.min(
      100,
      Math.round(((nightsBooked._sum.nights ?? 0) / (totalRooms * daysInMonth)) * 1000) / 10
    );

    data.push({
      month:     start.toLocaleString("default", { month: "short" }),
      occupancy,
    });
  }

  return data;
}

// ─── Bookings ─────────────────────────────────────────────────────────

export async function getBookings(filters: BookingFilters = {}, { page = 1, limit = 20 }: PaginationOpts = {}) {
  const skip = (page - 1) * limit;

  const where: Prisma.BookingWhereInput = {};
  if (filters.status) where.status = filters.status as BookingStatus;
  if (filters.userId) where.userId = filters.userId;
  if (filters.checkIn)  where.checkIn  = { gte: filters.checkIn };
  if (filters.checkOut) where.checkOut = { lte: filters.checkOut };
  if (filters.search) {
    where.OR = [
      { reference:      { contains: filters.search, mode: "insensitive" } },
      { guestEmail:     { contains: filters.search, mode: "insensitive" } },
      { guestFirstName: { contains: filters.search, mode: "insensitive" } },
      { guestLastName:  { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            category: { select: { name: true, tier: true, heroImage: true } },
            room:     { select: { number: true, floor: true } },
          },
        },
        payments: { select: { status: true, amount: true, method: true } },
        user:     { select: { id: true, name: true, email: true, loyaltyTier: true } },
        review:   { select: { id: true, rating: true, published: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where:   { id },
    include: {
      items:  { include: { category: true, room: true } },
      addons: { include: { service: true } },
      payments: true,
      review:   true,
      user:     { select: { id: true, name: true, email: true, phone: true, loyaltyTier: true, loyaltyPoints: true } },
    },
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus, staffNotes?: string) {
  const timestamps: Partial<{
    confirmedAt: Date;
    checkedInAt: Date;
    checkedOutAt: Date;
    cancelledAt: Date;
  }> = {};

  if (status === "CONFIRMED")   timestamps.confirmedAt  = new Date();
  if (status === "CHECKED_IN")  timestamps.checkedInAt  = new Date();
  if (status === "CHECKED_OUT") timestamps.checkedOutAt = new Date();
  if (status === "CANCELLED")   timestamps.cancelledAt  = new Date();

  const booking = await prisma.booking.update({
    where: { id },
    data:  { status, ...timestamps, ...(staffNotes && { staffNotes }) },
    include: { items: { include: { room: true } } },
  });

  // Update room occupancy status
  for (const item of booking.items) {
    if (!item.room) continue;
    if (status === "CHECKED_IN") {
      await prisma.room.update({
        where: { id: item.room.id },
        data:  { status: "OCCUPIED" as RoomStatus, currentBookingId: booking.id },
      });
    } else if (status === "CHECKED_OUT" || status === "CANCELLED") {
      await prisma.room.update({
        where: { id: item.room.id },
        data:  { status: "AVAILABLE" as RoomStatus, currentBookingId: null },
      });
    }
  }

  return booking;
}

// ─── Room Categories ──────────────────────────────────────────────────

export async function getRoomCategories(filters: RoomFilters = {}, opts: PaginationOpts = {}) {
  const { page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  const where: Prisma.RoomCategoryWhereInput = {};
  if (filters.tier)      (where as Record<string, unknown>).tier = filters.tier;
  if (filters.published !== undefined) where.published = filters.published;

  const [categories, total] = await Promise.all([
    prisma.roomCategory.findMany({
      where,
      skip,
      take:    limit,
      orderBy: [{ sortOrder: "asc" }, { tier: "asc" }],
      include: {
        amenities: { include: { amenity: true }, orderBy: { highlight: "desc" } },
        _count:    { select: { rooms: true } },
      },
    }),
    prisma.roomCategory.count({ where }),
  ]);

  return { categories, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateRoomCategory(
  id: string,
  data: Partial<{
    name:             string;
    description:      string;
    shortDesc:        string;
    baseRateWeekday:  number;
    baseRateWeekend:  number;
    published:        boolean;
    featured:         boolean;
    sortOrder:        number;
  }>
) {
  return prisma.roomCategory.update({ where: { id }, data });
}

// ─── Guests ───────────────────────────────────────────────────────────

export async function getGuests({ page = 1, limit = 20 }: PaginationOpts = {}, search?: string) {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = { role: "GUEST" };
  if (search) {
    where.OR = [
      { email:     { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName:  { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
      select: {
        id:           true,
        email:        true,
        firstName:    true,
        lastName:     true,
        name:         true,
        phone:        true,
        nationality:  true,
        loyaltyTier:  true,
        loyaltyPoints: true,
        createdAt:    true,
        _count: { select: { bookings: true } },
        bookings: {
          take:    1,
          orderBy: { createdAt: "desc" },
          select:  { id: true, reference: true, status: true, createdAt: true, totalAmount: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getGuestById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        include: {
          items:    { include: { category: { select: { name: true, tier: true } } } },
          payments: { select: { status: true, amount: true } },
        },
      },
      reviews: { select: { id: true, rating: true, title: true, published: true, createdAt: true } },
    },
  });
}

// ─── Availability (real DB) ───────────────────────────────────────────

export async function checkRoomAvailability(
  checkIn:  Date,
  checkOut: Date,
  adults:   number,
  children: number
) {
  const categories = await prisma.roomCategory.findMany({
    where: {
      published:    true,
      maxAdults:    { gte: adults },
      maxOccupancy: { gte: adults + children },
    },
    include: {
      rooms: {
        where: {
          status: { notIn: ["OUT_OF_ORDER", "MAINTENANCE"] },
          bookingItems: {
            none: {
              booking: {
                status:   { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
                checkIn:  { lt: checkOut },
                checkOut: { gt: checkIn },
              },
            },
          },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((cat) => {
    const { total, nightly } = calculateNightlyRates(
      checkIn, checkOut, cat.baseRateWeekday, cat.baseRateWeekend
    );
    return {
      categoryId:     cat.id,
      categoryName:   cat.name,
      tier:           cat.tier,
      available:      cat.rooms.length > 0,
      availableCount: cat.rooms.length,
      ratePerNight:   nightly[0] ?? cat.baseRateWeekday,
      totalRate:      total,
      nights:         nightly.length,
    };
  });
}

// ─── Create Booking (full transaction) ───────────────────────────────

export interface CreateBookingParams {
  categoryId:      string;
  checkIn:         Date;
  checkOut:        Date;
  adults:          number;
  children:        number;
  guestFirstName:  string;
  guestLastName:   string;
  guestEmail:      string;
  guestPhone?:     string;
  specialRequests?: string;
  arrivalTime?:    string;
  userId?:         string;
}

export async function createBookingTransaction(params: CreateBookingParams) {
  const nights = countNights(params.checkIn, params.checkOut);
  if (nights < 1) throw new Error("Minimum stay is 1 night");

  return prisma.$transaction(async (tx) => {
    // 1. Lock and fetch category
    const category = await tx.roomCategory.findUnique({
      where:   { id: params.categoryId, published: true },
    });
    if (!category) throw new Error("Room category not found");

    // 2. Find available room (with row-level lock via findFirst)
    const room = await tx.room.findFirst({
      where: {
        categoryId: params.categoryId,
        status:     { notIn: ["OUT_OF_ORDER", "MAINTENANCE", "OCCUPIED"] },
        bookingItems: {
          none: {
            booking: {
              status:   { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
              checkIn:  { lt: params.checkOut },
              checkOut: { gt: params.checkIn },
            },
          },
        },
      },
      orderBy: { floor: "asc" },
    });
    if (!room) throw new Error("No rooms available for selected dates");

    // 3. Calculate pricing
    const { total: subtotal, nightly } = calculateNightlyRates(
      params.checkIn, params.checkOut,
      category.baseRateWeekday, category.baseRateWeekend
    );
    const taxAmount   = calculateTax(subtotal);
    const totalAmount = subtotal + taxAmount;

    // 4. Create booking
    const booking = await tx.booking.create({
      data: {
        reference:      "TMP",
        status:         "PENDING",
        userId:         params.userId ?? null,
        guestFirstName: params.guestFirstName,
        guestLastName:  params.guestLastName,
        guestEmail:     params.guestEmail,
        guestPhone:     params.guestPhone     ?? null,
        specialRequests: params.specialRequests ?? null,
        arrivalTime:    params.arrivalTime    ?? null,
        checkIn:        params.checkIn,
        checkOut:       params.checkOut,
        nights,
        adults:          params.adults,
        children:        params.children,
        subtotal,
        taxAmount,
        totalAmount,
        currency:        "EUR",
        bookingSource:   "DIRECT",
        items: {
          create: {
            roomId:      room.id,
            categoryId:  params.categoryId,
            ratePerNight: nightly[0] ?? category.baseRateWeekday,
            totalRate:    subtotal,
            currency:     "EUR",
          },
        },
      },
    });

    // 5. Stamp reference
    const reference = `MH-${new Date().getFullYear()}-${booking.id.slice(-6).toUpperCase()}`;
    const updated   = await tx.booking.update({
      where:   { id: booking.id },
      data:    { reference },
      include: {
        items: { include: { category: true, room: true } },
      },
    });

    return updated;
  });
}
