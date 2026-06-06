// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  calculateNightlyRates,
  calculateTax,
  generateBookingReference,
  countNights,
} from "@/lib/utils";
import { ROOM_CATALOG } from "@/lib/data/rooms.data";
import type { ApiResponse, CreateBookingInput } from "@/types";
import { z } from "zod";

// ─── Validation Schema ────────────────────────────────────────────────

const createBookingSchema = z.object({
  categoryId:      z.string().min(1).max(200),
  checkIn:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "checkIn must be YYYY-MM-DD"),
  checkOut:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "checkOut must be YYYY-MM-DD"),
  adults:          z.number().int().min(1).max(10),
  children:        z.number().int().min(0).max(6).default(0),
  guestFirstName:  z.string().min(1).max(100),
  guestLastName:   z.string().min(1).max(100),
  guestEmail:      z.string().email(),
  guestPhone:      z.string().optional(),
  specialRequests: z.string().max(1000).optional(),
  arrivalTime:     z.string().optional(),
  addonIds:        z
    .array(z.object({ serviceId: z.string().min(1), quantity: z.number().int().min(1) }))
    .optional()
    .default([]),
  userId:          z.string().optional(),
});

// ─── POST — Create Booking ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:   "Validation failed",
          message: parsed.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const input = parsed.data as CreateBookingInput;

    const checkInDate  = new Date(input.checkIn  + "T12:00:00");
    const checkOutDate = new Date(input.checkOut + "T12:00:00");
    const nights       = countNights(checkInDate, checkOutDate);

    if (nights < 1) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Minimum stay is 1 night" },
        { status: 400 }
      );
    }

    // ── Try Prisma; fall back to static catalog ───────────────────────
    try {
      const { prisma } = await import("@/lib/db/prisma");

      const category = await prisma.roomCategory.findUnique({
        where:   { id: input.categoryId, published: true },
        include: { rooms: { where: { status: "AVAILABLE" } } },
      });

      if (!category) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Room category not found" },
          { status: 404 }
        );
      }

      const availableRoom = await prisma.room.findFirst({
        where: {
          categoryId: input.categoryId,
          status:     { notIn: ["OUT_OF_ORDER", "MAINTENANCE", "OCCUPIED"] },
          bookingItems: {
            none: {
              booking: {
                status:   { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
                checkIn:  { lt: checkOutDate },
                checkOut: { gt: checkInDate },
              },
            },
          },
        },
      });

      if (!availableRoom) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "No rooms available for the selected dates" },
          { status: 409 }
        );
      }

      const { total: subtotal } = calculateNightlyRates(
        checkInDate,
        checkOutDate,
        category.baseRateWeekday,
        category.baseRateWeekend
      );

      const taxAmount   = calculateTax(subtotal);
      const totalAmount = subtotal + taxAmount;

      const booking = await prisma.$transaction(async (tx) => {
        const newBooking = await tx.booking.create({
          data: {
            reference:      "TMP",
            status:         "PENDING",
            userId:         input.userId ?? null,
            guestFirstName: input.guestFirstName,
            guestLastName:  input.guestLastName,
            guestEmail:     input.guestEmail,
            guestPhone:     input.guestPhone ?? null,
            checkIn:        checkInDate,
            checkOut:       checkOutDate,
            nights,
            adults:          input.adults,
            children:        input.children ?? 0,
            subtotal,
            taxAmount,
            totalAmount,
            currency:        "EUR",
            specialRequests: input.specialRequests ?? null,
            arrivalTime:     input.arrivalTime    ?? null,
            bookingSource:   "DIRECT",
            items: {
              create: {
                roomId:      availableRoom.id,
                categoryId:  input.categoryId,
                ratePerNight: category.baseRateWeekday,
                totalRate:    subtotal,
                currency:     "EUR",
              },
            },
          },
        });

        const reference = generateBookingReference(newBooking.id);
        return tx.booking.update({
          where: { id: newBooking.id },
          data:  { reference },
          include: {
            items:  { include: { category: true, room: true } },
          },
        });
      });

      return NextResponse.json<ApiResponse<typeof booking>>(
        { success: true, data: booking, message: "Booking confirmed" },
        { status: 201 }
      );
    } catch (dbError: unknown) {
      // DB unavailable — return a mock confirmation so flow can be demonstrated
      const isConnectionError =
        dbError instanceof Error &&
        (dbError.message.includes("connect") ||
          dbError.message.includes("ECONNREFUSED") ||
          dbError.message.includes("P1001") ||
          dbError.message.includes("prepared statement"));

      if (!isConnectionError) throw dbError; // re-throw non-connection errors

      // Validate room exists in static catalog
      const staticRoom = ROOM_CATALOG.find((r) => r.id === input.categoryId || r.slug === input.categoryId);
      if (!staticRoom) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Room category not found" },
          { status: 404 }
        );
      }

      const { total: subtotal } = calculateNightlyRates(
        checkInDate,
        checkOutDate,
        staticRoom.baseRateWeekday,
        staticRoom.baseRateWeekend
      );

      const mockId        = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const mockReference = generateBookingReference(mockId);

      const mockBooking = {
        id:             mockId,
        reference:      mockReference,
        status:         "PENDING",
        guestFirstName: input.guestFirstName,
        guestLastName:  input.guestLastName,
        guestEmail:     input.guestEmail,
        checkIn:        checkInDate.toISOString(),
        checkOut:       checkOutDate.toISOString(),
        nights,
        adults:          input.adults,
        children:        input.children ?? 0,
        subtotal,
        taxAmount:       calculateTax(subtotal),
        totalAmount:     subtotal + calculateTax(subtotal),
        currency:        "EUR",
        specialRequests: input.specialRequests ?? null,
        arrivalTime:     input.arrivalTime    ?? null,
        createdAt:       new Date().toISOString(),
      };

      return NextResponse.json<ApiResponse<typeof mockBooking>>(
        { success: true, data: mockBooking, message: "Booking confirmed (demo mode)" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// ─── GET — List Bookings ──────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const status = searchParams.get("status") ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const skip   = (page - 1) * limit;

    try {
      const { prisma } = await import("@/lib/db/prisma");

      const where = {
        ...(status && { status: status as import('@prisma/client').BookingStatus }),
        ...(userId && { userId }),
      };

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          skip,
          take:    limit,
          orderBy: { createdAt: "desc" },
          include: {
            items:    { include: { category: { select: { name: true, tier: true } } } },
            payments: true,
          },
        }),
        prisma.booking.count({ where }),
      ]);

      return NextResponse.json<ApiResponse<typeof bookings>>({
        success: true,
        data:    bookings,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext:    page < Math.ceil(total / limit),
          hasPrev:    page > 1,
        },
      });
    } catch {
      return NextResponse.json<ApiResponse<never[]>>({
        success: true,
        data:    [],
        meta:    { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
      });
    }
  } catch (error) {
    console.error("[GET /api/bookings]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
