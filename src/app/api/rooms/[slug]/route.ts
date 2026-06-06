// src/app/api/rooms/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import type { ApiResponse } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await prisma.roomCategory.findUnique({
      where:   { slug, published: true },
      include: {
        amenities: {
          include: { amenity: true },
          orderBy: [{ highlight: "desc" }],
        },
        _count: {
          select: { rooms: { where: { status: "AVAILABLE" } } },
        },
      },
    });

    if (!category) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Room category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof category>>({
      success: true,
      data:    category,
    });
  } catch (error) {
    console.error("[GET /api/rooms/[slug]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
