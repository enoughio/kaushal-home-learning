import { query } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { searchParams } = new URL(req.url);

    // Get the expanded field query from searchParams
    const expanded = searchParams.get("expanded") === "true";

    const user = await query(
      "SELECT id, role, email, first_name, last_name, is_active, city FROM users WHERE id=$1",
      [id]
    );

    if (!user.rows[0])
      return NextResponse.json(
        { error: "USER_NOT_FOUND", message: "User not found", Code: "404" },
        { status: 404 }
      );

    let profile = null;

    // Confusion, How can we access role based profile from the respective tables without a link between user and role based profile of the user.
    if (expanded) {
      switch (user.rows[0].role) {
        case "teacher":
          profile = await query("SELECT * FROM teacher WHERE user_id=$1", [id]); // We need userId of the user here to access its role based profile.
          break;
        case "student":
          profile = await query("SELECT * FROM student WHERE user_id=$1", [id]);
          break;
        case "admin":
          profile = await query("SELECT * FROM admin WHERE user_id=$1", [id]);
          break;
      }
    }

    return NextResponse.json({
      ...user.rows[0],
      ...(profile ? { profile: profile.rows[0] } : {}),
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to fetch users",
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
