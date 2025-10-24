import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Missing required fields",
          code: 400,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid email format",
          code: 400,
        },
        { status: 400 }
      );
    }

    // check the user verifcation status, if the user is unverified, return error meassage

    const result = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Invalid email",
          code: 401,
        },
        { status: 401 }
      );
    }

    if (!result.is_verified) {
      return NextResponse.json(
        {
          error: "EMAIL_NOT_VERIFIED",
          message:
            "Email not verified. Please verify your email before logging in.",
          code: 403,
        },
        { status: 403 }
      );
    }

    // if password is not created yet and the user is verified, prompt user to reset password
    if (!result.password_hash) {
      return NextResponse.json(
        {
          error: "PASSWORD_NOT_SET",
          message: "Password not set. Please reset your password to login.",
          code: 403,
        },
        { status: 403 }
      );
    }


    // Check if user account is active
    if (!result.is_active) {
      return NextResponse.json(
        {
          error: "ACCOUNT_DISABLED",
          message: "Account has been disabled contact support team",
          code: 403,
        },
        { status: 403 }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, result.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Wrong password",
          code: 401,
        },
        { status: 401 }
      );
    }

    // Create JWT token
    const tokenPayload = {
      userId: result.id,
      email: result.email,
      role: result.role,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET!,
      { expiresIn: "15d" } // 15 days
    );

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: result.id,
        email: result.email,
        role: result.role,
        firstName: result.first_name,
        lastName: result.last_name,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60, // 15 days (seconds)
    });

    //TODO : Send login email to inform user

    return response;
  } catch (error: any) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Login failed",
        code: 500,
      },
      { status: 500 }
    );
  }
}
