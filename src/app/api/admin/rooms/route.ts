// src/app/api/admin/rooms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { getRoomCategories, updateRoomCategory } from "@/lib/services/db.service";
import type { ApiResponse } from "@/types";
import { z } from "zod";

const updateSchema = z.object({
  name:            z.string().min(1).max(100).optional(),
  description:     z.string().optional(),
  shortDesc:       z.string().max(300).optional(),
  baseRateWeekday: z.number().positive().optional(),
  baseRateWeekend: z.number().positive().optional(),
  published:       z.boolean().optional(),
  featured:        z.boolean().optional(),
  sortOrder:       z.number().int().min(0).optional(),
});

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !requireRole(session, "STAFF")) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page      = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit     = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const published = searchParams.get("published");

    const result = await getRoomCategories(
      { published: published === null ? undefined : published === "true" },
      { page, limit }
    );

    return NextResponse.json({
      success: true,
      data:    result.categories,
      meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages, hasNext: result.page < result.totalPages, hasPrev: result.page > 1 },
    });
  } catch (error) {
    console.error("[GET /api/admin/rooms]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !requireRole(session, "ADMIN")) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id   = searchParams.get("id");
    if (!id)   return NextResponse.json<ApiResponse>({ success: false, error: "id required" }, { status: 400 });

    const body   = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json<ApiResponse>({ success: false, error: "Validation failed" }, { status: 400 });

    const room = await updateRoomCategory(id, parsed.data);
    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error("[PATCH /api/admin/rooms]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to update room" }, { status: 500 });
  }
}
