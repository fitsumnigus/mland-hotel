// src/app/api/admin/guests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, requireRole } from "@/lib/auth";
import { getGuestById } from "@/lib/services/db.service";
import type { ApiResponse } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session || !requireRole(session, "STAFF")) {
    return NextResponse.json<ApiResponse>({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const guest = await getGuestById(id);
    if (!guest) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Guest not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: guest });
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, error: "Failed to load guest" }, { status: 500 });
  }
}
