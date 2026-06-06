// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/auth";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    return NextResponse.json<ApiResponse<typeof session>>({ success: true, data: session });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Auth check failed" },
      { status: 500 }
    );
  }
}
