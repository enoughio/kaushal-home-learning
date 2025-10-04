import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../../../database/db";


export async function POST (req : NextRequest ) {
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

        // Query user from database (assuming you have a 'users' table for verified users)
        const result = await query(
            'SELECT id, email, password, role, first_name, last_name, is_active FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                {
                    error: "INVALID_CREDENTIALS",
                    message: "Invalid email",
                    code: 401,
                  
                },
                { status: 401 }
            );
        }
        const user = result.rows[0];

        // Check if user account is active
        if (!user.is_active) {
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
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
            userId: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET!,
            { expiresIn: '15d' } // 15 days as per your documentation
        );

        // Create response
        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days 
        });

        //TODO : Send login email to inform user


        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        
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