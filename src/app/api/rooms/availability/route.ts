// src/app/api/rooms/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { calculateNightlyRates } from "@/lib/utils";
import { ROOM_CATALOG } from "@/lib/data/rooms.data";
import type { ApiResponse, RoomAvailabilityResult } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const checkIn  = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults   = Math.max(1, parseInt(searchParams.get("adults")   ?? "1", 10));
    const children = Math.max(0, parseInt(searchParams.get("children") ?? "0", 10));

    if (!checkIn || !checkOut) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "checkIn and checkOut are required" },
        { status: 400 }
      );
    }

    const checkInDate  = new Date(checkIn  + "T12:00:00");
    const checkOutDate = new Date(checkOut + "T12:00:00");

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid date format — use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (checkInDate >= checkOutDate) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "checkOut must be after checkIn" },
        { status: 400 }
      );
    }

    // ── Attempt Prisma query; fall back to static catalog if DB unavailable ──
    let results: RoomAvailabilityResult[];

    try {
      const { prisma } = await import("@/lib/db/prisma");

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
                    checkIn:  { lt: checkOutDate },
                    checkOut: { gt: checkInDate },
                  },
                },
              },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      });

      results = categories
        .filter((c) => c.rooms.length > 0)
        .map((category) => {
          const { total, nightly } = calculateNightlyRates(
            checkInDate,
            checkOutDate,
            category.baseRateWeekday,
            category.baseRateWeekend
          );
          return {
            categoryId:     category.id,
            categoryName:   category.name,
            tier:           category.tier,
            available:      true,
            availableCount: category.rooms.length,
            ratePerNight:   nightly[0] ?? category.baseRateWeekday,
            totalRate:      total,
            nights:         nightly.length,
          };
        });
    } catch {
      // DB unavailable — derive availability from static catalog
      results = ROOM_CATALOG
        .filter((room) =>
          room.maxAdults    >= adults &&
          room.maxOccupancy >= adults + children
        )
        .map((room) => {
          const { total, nightly } = calculateNightlyRates(
            checkInDate,
            checkOutDate,
            room.baseRateWeekday,
            room.baseRateWeekend
          );
          return {
            categoryId:     room.id,
            categoryName:   room.name,
            tier:           room.tier,
            available:      true,
            availableCount: 2, // optimistic static count
            ratePerNight:   nightly[0] ?? room.baseRateWeekday,
            totalRate:      total,
            nights:         nightly.length,
          };
        });
    }

    return NextResponse.json<ApiResponse<RoomAvailabilityResult[]>>({
      success: true,
      data:    results,
    });
  } catch (error) {
    console.error("[GET /api/rooms/availability]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
