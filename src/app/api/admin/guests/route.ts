// src/app/api/admin/guests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { getGuests } from "@/lib/services/db.service";
import type { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !requireRole(session, "STAFF")) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, parseInt(searchParams.get("page")   ?? "1", 10));
    const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search") ?? undefined;

    const result = await getGuests({ page, limit }, search);

    return NextResponse.json({
      success: true,
      data:    result.users,
      meta: {
        page: result.page, limit: result.limit, total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/guests]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to fetch guests" }, { status: 500 });
  }
}
