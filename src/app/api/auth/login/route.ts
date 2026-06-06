// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken, setSessionCookie } from "@/lib/auth";
import type { ApiResponse } from "@/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email or password format" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    let session: {
      userId: string;
      email: string;
      role: string;
      firstName: string | null;
      lastName: string | null;
    } | null = null;

    // --------------------------------------------------
    // 🟢 OPTION 1: MASTER LOGIN (DEV ONLY - ANY EMAIL/PASS)
    // --------------------------------------------------
    if (process.env.NODE_ENV === "development") {
      const MASTER_EMAIL = "admin@gmail.com";
      const MASTER_PASSWORD = "admin123";

      if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
        session = {
          userId: "master-admin",
          email,
          role: "ADMIN",
          firstName: "Master",
          lastName: "Admin",
        };
      }
    }

    // --------------------------------------------------
    // 🟡 OPTION 2: DATABASE LOGIN
    // --------------------------------------------------
    if (!session) {
      try {
        const { prisma } = await import("@/lib/db/prisma");

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user?.passwordHash) {
          const valid = await bcrypt.compare(password, user.passwordHash);

          if (valid && ["STAFF", "ADMIN", "SUPER_ADMIN"].includes(user.role)) {
            session = {
              userId: user.id,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
            };
          }
        }
      } catch (dbError) {
        console.error("DB login error:", dbError);
      }
    }

    // --------------------------------------------------
    // 🟠 OPTION 3: ENV FALLBACK ADMIN
    // --------------------------------------------------
    if (!session) {
      const adminEmail = process.env.ADMIN_EMAIL ?? "admin@marklandhotel.com";
      const adminPass = process.env.ADMIN_PASSWORD ?? "Markland2024!";

      if (email === adminEmail && password === adminPass) {
        session = {
          userId: "env-admin",
          email: adminEmail,
          role: "ADMIN",
          firstName: "Hotel",
          lastName: "Admin",
        };
      }
    }

    // --------------------------------------------------
    // ❌ INVALID LOGIN
    // --------------------------------------------------
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // ✅ SUCCESS
    // --------------------------------------------------
    const token = await signToken(session);
    await setSessionCookie(token);

    return NextResponse.json<ApiResponse<typeof session>>({
      success: true,
      data: session,
      message: "Login successful",
    });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}