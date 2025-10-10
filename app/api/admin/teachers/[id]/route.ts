import { query } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const teacher = await query(
      `SELECT u.id, u.role, t.id AS teacher_id, u.email, u.first_name, u.last_name, u.is_verified, u.is_active, u.city, u.phone, u.pincode, u.date_of_birth, u.profile_image_url, t.qualification, t.experience_years, subjects_taught, t.approval_status, t.teaching_mode, t.hourly_rate, t.monthly_salary, t.salary_status, t.resume_url, t.certificates_url, a.id AS approver_id, t.approved_at, a.email, a.first_name, a.last_name, t.rejection_reason, t.availability_schedule, t.max_students, t.current_students, t.rating, t.total_reviews
      FROM users u 
      INNER JOIN teachers t ON u.id = t.user_id 
      LEFT JOIN users a ON t.approved_by = a.id 
      WHERE u.id=$1 AND u.role = 'teacher'`, // Acts as a safety check for the case where this user's role is mistakenly marked as something else other than the teacher or mistakenly inserted on teacher table even if its not.
      [id]
    );

    if (!teacher.rows[0])
      return NextResponse.json(
        {
          error: "TEACHER_NOT_FOUND",
          message: "No teacher found",
          Code: "404",
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        student: teacher.rows[0],
        message: "Teacher details fetched successfully",
        Code: "200",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to fetch teacher details",
        code: 500,
      },
      { status: 500 }
    );
  }
}
