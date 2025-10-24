import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateVerificationToken } from "@/app/api/_lib/verify";
import { sendNotificationEmail } from "@/helper/mail/emailHelpers";
import { ForgotPasswordRequest, ApiResponse } from "@/lib/types";

// Helper function to create standardized error responses
function createErrorResponse(error: {
  code: string;
  message: string;
  status: number;
  details?: any;
}): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message: error.message,
      error: {
        code: error.code,
        details: error.details,
      },
    },
    { status: error.status }
  );
}

// Helper function to create success responses
function createSuccessResponse(message: string): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: true,
    message,
  });
}

// Input validation helper
function validateForgotPasswordInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Request body must be a valid JSON object');
    return { isValid: false, errors };
  }

  const { email } = data;

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email format');
    }
  }

  return { isValid: errors.length === 0, errors };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse and validate request body
    let requestData: ForgotPasswordRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      return createErrorResponse({
        code: 'INVALID_JSON',
        message: 'Invalid JSON in request body',
        status: 400,
      });
    }

    // Validate input
    const validation = validateForgotPasswordInput(requestData);
    if (!validation.isValid) {
      return createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        status: 400,
        details: { errors: validation.errors },
      });
    }

    const { email } = requestData;
    const trimmedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email: trimmedEmail },
      select: {
        id: true,
        email: true,
        first_name: true,
        is_active: true,
        is_verified: true,
      },
    });

    // Always return success for security reasons (don't reveal if email exists)
    if (!user) {
      return createSuccessResponse(
        'If an account with this email exists, we have sent you a password reset link.'
      );
    }

    // Check if user account is active and verified
    if (!user.is_active) {
      return createSuccessResponse(
        'If an account with this email exists, we have sent you a password reset link.'
      );
    }

    if (!user.is_verified) {
      return createSuccessResponse(
        'If an account with this email exists, we have sent you a password reset link.'
      );
    }

    // Generate reset token
    const resetToken = await generateVerificationToken();

    // Update user with reset token and expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires: expiresAt,
      },
    });

    // Send reset email
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/create-password?token=${resetToken}`;

      await sendNotificationEmail(user.email, {
        name: user.first_name || 'User',
        title: 'Password Reset Request',
        message: 'You requested a password reset for your Kaushaly Home Learning account. Click the button below to reset your password.',
        actionUrl: resetUrl,
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Don't return error to user for security reasons
    }

    return createSuccessResponse(
      'If an account with this email exists, we have sent you a password reset link.'
    );

  } catch (error: any) {
    console.error('Forgot password error:', error);

    // Handle specific database errors
    if (error?.code === 'P1001') {
      return createErrorResponse({
        code: 'DATABASE_ERROR',
        message: 'Service temporarily unavailable. Please try again later.',
        status: 503,
      });
    }

    return createErrorResponse({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      status: 500,
    });
  }
}