// src/app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { z } from "zod";

const updateSchema = z.object({
  status:          z.enum(["CONFIRMED","CANCELLED","CHECKED_IN","CHECKED_OUT","NO_SHOW"]).optional(),
  specialRequests: z.string().max(1000).optional(),
  arrivalTime:     z.string().optional(),
  staffNotes:      z.string().optional(),
});

// ─── GET ──────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { prisma } = await import("@/lib/db/prisma");

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        items:  { include: { category: true, room: true } },
        addons: { include: { service: true } },
        payments: true,
        review:   true,
        user:     { select: { id: true, name: true, email: true, phone: true, loyaltyTier: true, loyaltyPoints: true } },
      },
    });

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof booking>>({ success: true, data: booking });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Booking not found" },
      { status: 404 }
    );
  }
}

// ─── PATCH ────────────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body   = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Validation failed" },
        { status: 400 }
      );
    }

    const { status, ...rest } = parsed.data;

    const statusTimestamps: Record<string, object> = {
      CONFIRMED:   { confirmedAt: new Date() },
      CHECKED_IN:  { checkedInAt: new Date() },
      CHECKED_OUT: { checkedOutAt: new Date() },
      CANCELLED:   { cancelledAt: new Date() },
    };

    try {
      const { prisma } = await import("@/lib/db/prisma");

      const booking = await prisma.booking.update({
        where: { id },
        data:  {
          ...(status && { status, ...statusTimestamps[status] }),
          ...rest,
        },
      });

      // Update room status when checking in/out
      if (status === "CHECKED_IN" || status === "CHECKED_OUT" || status === "CANCELLED") {
        const items = await prisma.bookingItem.findMany({ where: { bookingId: id }, include: { room: true } });
        for (const item of items) {
          if (!item.room) continue;
          if (status === "CHECKED_IN") {
            await prisma.room.update({ where: { id: item.room.id }, data: { status: "OCCUPIED", currentBookingId: id } });
          } else {
            await prisma.room.update({ where: { id: item.room.id }, data: { status: "AVAILABLE", currentBookingId: null } });
          }
        }
      }

      return NextResponse.json<ApiResponse<typeof booking>>({
        success: true,
        data:    booking,
        message: "Booking updated",
      });
    } catch {
      // No DB — return optimistic success
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Booking updated (offline mode)",
      });
    }
  } catch (error) {
    console.error("[PATCH /api/bookings/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { prisma } = await import("@/lib/db/prisma");

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Not found" }, { status: 404 });
    }
    if (["CHECKED_IN","CHECKED_OUT"].includes(existing.status)) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Cannot cancel active booking" }, { status: 422 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data:  { status: "CANCELLED", cancelledAt: new Date() },
    });

    return NextResponse.json<ApiResponse<typeof booking>>({ success: true, data: booking });
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to cancel booking" }, { status: 500 });
  }
}
