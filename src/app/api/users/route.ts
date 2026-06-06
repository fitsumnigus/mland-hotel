// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import type { ApiResponse } from "@/types";
import { z } from "zod";

const registerSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8).max(100),
  firstName: z.string().min(1).max(100),
  lastName:  z.string().min(1).max(100),
  phone:     z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Validation failed", message: parsed.error.message },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, phone } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        name:  `${firstName} ${lastName}`,
        phone: phone ?? null,
        role:  "GUEST",
      },
      select: {
        id:           true,
        email:        true,
        firstName:    true,
        lastName:     true,
        name:         true,
        role:         true,
        loyaltyTier:  true,
        loyaltyPoints: true,
        createdAt:    true,
      },
    });

    return NextResponse.json<ApiResponse<typeof user>>(
      { success: true, data: user, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
