// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { getDashboardStats, getRevenueByMonth, getOccupancyByMonth } from "@/lib/services/db.service";
import type { ApiResponse } from "@/types";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || !requireRole(session, "STAFF")) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [stats, revenue, occupancy] = await Promise.all([
      getDashboardStats(),
      getRevenueByMonth(12),
      getOccupancyByMonth(6),
    ]);

    return NextResponse.json({
      success: true,
      data:    { stats, revenue, occupancy },
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to load stats" }, { status: 500 });
  }
}
