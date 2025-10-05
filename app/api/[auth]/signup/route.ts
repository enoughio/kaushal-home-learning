import { NextRequest, NextResponse } from "next/server";
import { query } from "@/database/db";
import { sendVerificationEmail } from "@/helper/mail/emailHelpers";
import crypto from "crypto";


export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, role } = await req.json();

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
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

    // Validate role
    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid role",
          code: 400,
        },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // create temporary user object in database until email verification is done
    const result = await query(
      "INSERT INTO temp_users (email, first_name, last_name, role, verification_token, expires_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id",
      [email, firstName, lastName, role, verificationToken, tokenExpiry]
    );

    const userId = result.rows[0].id;

    //TODO: improve  this code if email service fails currently the whole process fails, this needed to be improved
    //TODO:  add OPT(Verification code option)
    
    // Send email verification
    try {
      const verificationUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/verify?token=${verificationToken}`;

      await sendVerificationEmail(email, {
        name: firstName,
        verificationToken,
        verificationUrl,
      });
      console.log(`Verification email sent to ${email}`);
      
    } catch (emailError) {
      // fail the registration if email fails, but log it
      console.error("Failed to send verification email:", emailError);  
    }

    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
        userId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Database error:", error);

    // Handle duplicate email error
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error: "DUPLICATE_EMAIL",
          message: "Email already exists",
          code: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to create user",
        code: 500,
      },
      { status: 500 }
    );
  }
}
