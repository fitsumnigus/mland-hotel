// src/app/api/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ROOM_CATALOG } from "@/lib/data/rooms.data";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get("page")   ?? "1", 10));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));
    const tier     = searchParams.get("tier") ?? undefined;
    const featured = searchParams.get("featured");

    // Try DB first, fall back to static catalog
    try {
      const { prisma } = await import("@/lib/db/prisma");
      const { RoomTier } = await import("@prisma/client");

      const where: Record<string, unknown> = { published: true };
      if (tier && Object.values(RoomTier).includes(tier as typeof RoomTier[keyof typeof RoomTier])) {
        where.tier = tier as typeof RoomTier[keyof typeof RoomTier];
      }
      if (featured === "true")  where.featured = true;
      if (featured === "false") where.featured = false;

      const skip = (page - 1) * limit;
      const [categories, total] = await Promise.all([
        prisma.roomCategory.findMany({
          where,
          skip,
          take:    limit,
          orderBy: [{ sortOrder: "asc" }],
          include: {
            amenities: { include: { amenity: true }, orderBy: { highlight: "desc" } },
            _count:    { select: { rooms: { where: { status: "AVAILABLE" } } } },
          },
        }),
        prisma.roomCategory.count({ where }),
      ]);

      return NextResponse.json<ApiResponse<typeof categories>>({
        success: true,
        data:    categories,
        meta: {
          page, limit, total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    } catch {
      // Static fallback
      let rooms = ROOM_CATALOG.filter((r) => {
        if (tier && r.tier !== tier) return false;
        if (featured === "true"  && !r.featured) return false;
        if (featured === "false" &&  r.featured) return false;
        return true;
      });

      const total = rooms.length;
      const start = (page - 1) * limit;
      rooms = rooms.slice(start, start + limit);

      return NextResponse.json<ApiResponse<typeof rooms>>({
        success: true,
        data:    rooms,
        meta: {
          page, limit, total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    }
  } catch (error) {
    console.error("[GET /api/rooms]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
