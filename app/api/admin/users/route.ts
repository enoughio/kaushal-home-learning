import { query } from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get the full URL
    const { searchParams } = new URL(req.url);

    // Get specific query values
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const validLimit = limit < 0 ? 10 : Math.min(limit, 10);

    // Validate role
    const validRoles = ["student", "teacher", "admin"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid role, Please specify a valid role",
          code: 400,
        },
        { status: 400 }
      );
    }

    // Base query
    let queryText = `
    SELECT id, role, email, first_name, last_name, is_active, city
    FROM users
  `;

    // Dynamic filters
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Optional filters
    if (role) {
      conditions.push(`role = $${paramIndex++}`);
      params.push(role);
    }
    if (city) {
      conditions.push(`city ILIKE $${paramIndex++}`);
      params.push(`%${city}%`);
    }
    if (search) {
      conditions.push(
        `(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Combine WHERE if any conditions exist
    if (conditions.length > 0) {
      queryText += " WHERE " + conditions.join(" AND ");
    }

    // Add pagination (always)
    queryText += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(validLimit, (page - 1) * validLimit);

    // Final query
    const users = await query(queryText, params);

    if (!users.rows[0])
      return NextResponse.json(
        {
          error: "NO_USER_FOUND",
          message: "No user found",
          Code: "404",
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        users: users.rows,
        message: "Fetched users successfully",
        Code: "200",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);

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
