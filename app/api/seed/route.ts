import { query } from "../../../database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Create users table
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) DEFAULT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                phone VARCHAR(20),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                pincode VARCHAR(10),
                date_of_birth DATE,
                location TEXT,

                is_verified BOOLEAN DEFAULT false,
                verification_token VARCHAR(255),
                verification_token_expires TIMESTAMP,
                reset_token VARCHAR(255),
                reset_token_expires TIMESTAMP,
                access_token VARCHAR(255),
                
                profile_image_url VARCHAR(500),
                is_active BOOLEAN DEFAULT true,
                is_deleted BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            );
        `);

        // Create temp_users table for signup process
        await query(`
            CREATE TABLE IF NOT EXISTS temp_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                role VARCHAR(50) NOT NULL,
                verification_token VARCHAR(255),
                expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours'),
                created_at TIMESTAMP DEFAULT NOW(),
                verified BOOLEAN DEFAULT FALSE
            );
        `);

        // Create students table for additional student info
        await query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                grade VARCHAR(20),
                school_name VARCHAR(200),
                parent_name VARCHAR(100),
                parent_phone VARCHAR(20),
                subjects_interested TEXT[],
                monthly_fee DECIMAL(10,2),
                payment_status VARCHAR(20) DEFAULT 'pending',
                enrollment_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create teachers table for additional teacher info
        await query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                qualification VARCHAR(200),
                experience_years INTEGER,
                subjects_taught TEXT[],
                teaching_mode VARCHAR(20) CHECK (teaching_mode IN ('online', 'offline', 'both')),
                hourly_rate DECIMAL(10,2),
                approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
                rating DECIMAL(3,2) DEFAULT 0.0,
                total_reviews INTEGER DEFAULT 0,
                current_students INTEGER DEFAULT 0,
                max_students INTEGER DEFAULT 20,
                documents JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create assignments table
        await query(`
            CREATE TABLE IF NOT EXISTS assignments (
                id SERIAL PRIMARY KEY,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                subject VARCHAR(100),
                due_date DATE,
                assignment_type VARCHAR(50),
                max_marks INTEGER,
                instructions TEXT,
                status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'graded')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create attendance table
        await query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')),
                notes TEXT,
                session_duration INTEGER,
                subject VARCHAR(100),
                marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create payments table
        await query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                payment_type VARCHAR(50),
                payment_method VARCHAR(50),
                payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
                transaction_id VARCHAR(100) UNIQUE,
                payment_date DATE DEFAULT CURRENT_DATE,
                due_date DATE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create notifications table
        await query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50),
                priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
                is_read BOOLEAN DEFAULT false,
                delivery_method VARCHAR(20) DEFAULT 'email',
                scheduled_at TIMESTAMP,
                sent_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create indexes for better performance
        await query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_temp_users_email ON temp_users(email);
            CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
            CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
            CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
            CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
            CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
        `);

        return NextResponse.json({
            message: "Database tables created successfully",
            tables: [
                "users", 
                "temp_users", 
                "students", 
                "teachers", 
                "assignments", 
                "attendance", 
                "payments", 
                "notifications"
            ],
            indexes: "Created performance indexes",
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Seed error:', error);
        
        return NextResponse.json(
            {
                error: "SEED_ERROR",
                message: "Failed to create database tables",
                code: 500,
                details: { error: error.message }
            },
            { status: 500 }
        );
    }
}