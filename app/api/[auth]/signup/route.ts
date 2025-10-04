import { NextRequest, NextResponse } from "next/server";
import { query } from "../../../../database/db";

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
                    details: { email: "Please provide a valid email address" }
                },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['student', 'teacher', 'admin'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                {
                    error: "VALIDATION_ERROR",
                    message: "Invalid role",
                    code: 400,
                    details: { role: "Role must be one of: student, teacher, admin" }
                },
                { status: 400 }
            );
        }

        // create temporary user object in database until email verification is don

        const result = await query(
            'INSERT INTO temp_users (email, first_name, last_name, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
            [email, firstName, lastName, role]
        );
        const userId = result.rows[0].id;
        
        // TODO: Send email verification token
        
        
        return NextResponse.json({ 
            message: "Registration successful. Please verify your email.",
            userId
        }, { status: 201 });

    } catch (error: any) {
        console.error('Database error:', error);
        
        // Handle duplicate email error
        if (error.code === '23505') {
            return NextResponse.json(
                {
                    error: "DUPLICATE_EMAIL",
                    message: "Email already exists",
                    code: 400,
                    details: { email: "This email is already registered" }
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: "INTERNAL_ERROR",
                message: "Failed to create user",
                code: 500,
                details: {}
            },
            { status: 500 }
        );
    }
}

