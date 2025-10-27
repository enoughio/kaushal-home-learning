import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};
    if (role) whereClause.role = role;
    if (status === "active") whereClause.is_active = true;
    if (status === "inactive") whereClause.is_active = false;

    const [users, totalUsers] = await Promise.all([
      prisma.users.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.users.count({ where: whereClause }),
    ]);

    const formattedUsers = users.map((user) => ({
      id: user.id.toString(),
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
      role: user.role,
      status: user.is_active ? "active" : "inactive",
      joinedAt: user.created_at.toISOString(),
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
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch users",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
