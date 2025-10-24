import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        {
          error: "INVALID_TOKEN",
          message: "Verification token is required",
        },
        { status: 400 }
      );
    }

    // Find the user with the verification token
    const user = await prisma.temp_users.findFirst({
      where: {
        verification_token: token,
        verified: false,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "INVALID_TOKEN",
          message: "Invalid or expired verification token",
        },
        { status: 400 }
      );
    }

    // Check if token has expired
    const now = new Date();
    if (user.expires_at && user.expires_at < now) {
      return NextResponse.json(
        {
          error: "TOKEN_EXPIRED",
          message: "Verification token has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Update user as verified and clear the token
    await prisma.temp_users.update({
      where: { id: user.id },
      data: {
        verified: true,
        verification_token: null,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully! Your account is now pending approval from our team.",
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      {
        error: "VERIFICATION_FAILED",
        message: "Unable to verify email. Please try again later.",
      },
      { status: 500 }
    );
  }
}