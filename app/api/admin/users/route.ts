import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { UserResponse } from "@/lib/types";

// Define schema for query parameters
const querySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("20").transform(Number),
  role: z.enum(["admin", "teacher", "student", "all"]).optional(),
  status: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const { page, limit, role, status } = querySchema.parse(searchParams);

    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};
    if (role && role !== "all") whereClause.role = role; // Handle "all" as no filtering
    if (status === "active") whereClause.is_active = true;
    else if (status === "inactive") whereClause.is_active = false;

    // Fetch users and total count in parallel
    const [users, totalUsers] = await Promise.all([
      prisma.users.findMany({
        where: whereClause,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          is_active: true,
          created_at: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.users.count({ where: whereClause }),
    ]);

    // Format users for the response
    const formattedUsers: UserResponse[] = users.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role as "admin" | "teacher" | "student", // Ensure type compatibility
      isActive: user.is_active,
      createdAt: user.created_at.toISOString(),
    }));

    const totalPages = Math.ceil(totalUsers / limit);

    return respondWithSuccess({
      data: {
        users: formattedUsers,
        page,
        totalPages,
        totalUsers,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch users",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
