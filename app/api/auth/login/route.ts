import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

// Type definitions for better type safety
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
  };
  error?: {
    code: string;
    details?: any;
  };
}

interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: any;
}

// Helper function to create standardized error responses
function createErrorResponse(error: ApiError): NextResponse<LoginResponse> {
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
function createSuccessResponse(
  message: string,
  user: LoginResponse['user']
): NextResponse<LoginResponse> {
  const response = NextResponse.json({
    success: true,
    message,
    user,
  });

  return response;
}

// Input validation helper
function validateLoginInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Request body must be a valid JSON object');
    return { isValid: false, errors };
  }

  const { email, password } = data;

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email format');
    }
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return { isValid: errors.length === 0, errors };
}

export async function POST(req: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    // Parse and validate request body
    let requestData: LoginRequest;
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
    const validation = validateLoginInput(requestData);
    if (!validation.isValid) {
      return createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        status: 400,
        details: { errors: validation.errors },
      });
    }

    const { email, password } = requestData;
    const trimmedEmail = email.trim().toLowerCase();

    // Find user in database
    const user = await prisma.users.findUnique({
      where: { email: trimmedEmail },
      select: {
        id: true,
        email: true,
        password_hash: true,
        role: true,
        first_name: true,
        last_name: true,
        is_verified: true,
        is_active: true,
      },
    });

    if (!user) {
      return createErrorResponse({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        status: 401,
      });
    }

    // Check email verification status
    if (!user.is_verified) {
      return createErrorResponse({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email address before logging in',
        status: 403,
      });
    }

    // Check if password is set
    if (!user.password_hash) {
      return createErrorResponse({
        code: 'PASSWORD_NOT_SET',
        message: 'Password not set. Please reset your password to continue',
        status: 403,
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return createErrorResponse({
        code: 'ACCOUNT_DISABLED',
        message: 'Your account has been disabled. Please contact support',
        status: 403,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return createErrorResponse({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        status: 401,
      });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return createErrorResponse({
        code: 'SERVER_ERROR',
        message: 'Authentication service temporarily unavailable',
        status: 500,
      });
    }

    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: '15d',
    });

    // Create success response
    const response = createSuccessResponse('Login successful', {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);

    // Handle specific database errors
    if (error?.code === 'P1001') {
      return createErrorResponse({
        code: 'DATABASE_ERROR',
        message: 'Database connection failed',
        status: 503,
      });
    }

    // Generic server error
    return createErrorResponse({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later',
      status: 500,
    });
  }
}
