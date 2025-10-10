import { query } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const student = await query(
      `SELECT u.id, u.role, s.id AS student_id, u.email, u.first_name, u.last_name, u.is_verified, u.is_active, u.city, u.phone, u.pincode, u.date_of_birth, u.profile_image_url, s.grade, s.school_name, s.parent_name, s.parent_phone, s.parent_email, s.emergency_contact, s.subjects_interested, s.learning_goals, s.preferred_schedule, s.monthly_fee, s.fee_due_date, s.payment_status, s.grace_period_end, s.enrollment_date
      FROM users u 
      INNER JOIN students s ON u.id = s.user_id 
      WHERE u.role = 'student'`
    );

    if (!student.rows[0])
      return NextResponse.json(
        {
          error: "NO_STUDENT_FOUND",
          message: "No students found",
          Code: "404",
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        student: student.rows[0],
        message: "Student details fetched successfully",
        Code: "200",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to fetch student details",
        code: 500,
      },
      { status: 500 }
    );
  }
}
