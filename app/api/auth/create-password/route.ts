import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { CreatePasswordRequest, ApiResponse } from "@/lib/types";


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
function validateCreatePasswordInput(data: any): { isValid: boolean; errors: string[] } {
  let errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Request body must be a valid JSON object');
    return { isValid: false, errors };
  }

  const { token, password, confirmPassword } = data;

  if (!token || typeof token !== 'string') {
    errors.push('Reset token is required');
  } else if (token.length !== 64) { // 32 bytes * 2 for hex
    errors.push('Invalid reset token');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  if (!confirmPassword || typeof confirmPassword !== 'string') {
    errors.push('Password confirmation is required');
  }

  if (password && confirmPassword && password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return { isValid: errors.length === 0, errors };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse and validate request body
    let requestData: CreatePasswordRequest;
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
    const validation = validateCreatePasswordInput(requestData);
    if (!validation.isValid) {
      return createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        status: 400,
        details: { errors: validation.errors },
      });
    }

    const { token, password } = requestData;

    // Find user by reset token
    const user = await prisma.users.findFirst({
      where: {
        reset_token: token,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        reset_token_expires: true,
      },
    });

    if (!user) {
      return createErrorResponse({
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired reset token',
        status: 400,
      });
    }

    // Check if token has expired
    const now = new Date();
    if (!user.reset_token_expires || user.reset_token_expires < now) {
      return createErrorResponse({
        code: 'TOKEN_EXPIRED',
        message: 'Reset token has expired. Please request a new password reset.',
        status: 400,
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      },
    });

    return createSuccessResponse(
      'Password updated successfully! You can now log in with your new password.'
    );

  } catch (error: any) {
    console.error('Create password error:', error);

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

