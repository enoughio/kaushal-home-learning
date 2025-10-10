import { query } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const student = await query(
      `SELECT u.id, u.role, s.id AS student_id, u.email, u.first_name, u.last_name, u.is_verified, u.is_active, u.city, u.phone, u.pincode, u.date_of_birth, u.profile_image_url, s.grade, s.school_name, s.parent_name, s.parent_phone, s.parent_email, s.emergency_contact, s.subjects_interested, s.learning_goals, s.preferred_schedule, s.monthly_fee, s.fee_due_date, s.payment_status, s.grace_period_end, s.enrollment_date
      FROM users u 
      INNER JOIN students s ON u.id = s.user_id 
      WHERE u.id=$1 AND u.role = 'student'`,
      [id]
    );

    if (!student.rows[0])
      return NextResponse.json(
        {
          error: "STUDENT_NOT_FOUND",
          message: "No student found",
          Code: "404",
        },
        { status: 404 }
      );

    return NextResponse.json(
      { student: student.rows[0], message: "Student details fetched successfully", Code: "200" },
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const data = await req.json();

    // As of now i had considered updation of this fields only as mentioned in the API documentation.
    const { status, first_name, last_name, city } = data;

    const MAX_LENGTH = 50;

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string" && value.length > MAX_LENGTH) {
        return NextResponse.json(
          {
            error: "INVALID_DATA",
            message: `${key} exceeds max length of ${MAX_LENGTH}`,
          },
          { status: 400 }
        );
      }
    }

    if (status && !["active", "inactive"].includes(status)) {
      return NextResponse.json(
        {
          error: "INVALID_STATUS",
          message: "Invalid status, Please specify a valid status",
        },
        { status: 400 }
      );
    }

    // Filter out undefined fields (only update fields provided)
    const fields = Object.entries(data).filter(
      ([key, value]) => key !== "status" && value !== undefined
    );

    if (status) fields.push(["is_active", status === "active"]);

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "NO_DATA", message: "No fields to update", code: "400" },
        { status: 400 }
      );
    }

    // Build SET clause dynamically
    const setClause = fields
      .map(([key], i) => `"${key}" = $${i + 1}`)
      .join(", ");

    const values = fields.map(([_, value]) => value);

    // Add user id at the end
    values.push(id);

    const queryText = `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING *`;

    const result = await query(queryText, values);

    return NextResponse.json(
      {
        user: result.rows[0],
        message: "User updated successfully",
        code: "200",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to update user profile",
        code: 500,
      },
      { status: 500 }
    );
  }
}
