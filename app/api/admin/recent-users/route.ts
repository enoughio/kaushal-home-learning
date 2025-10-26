import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const recentUsers = await prisma.users.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      include: {
        students: true,
        teachers: true,
      },
    });

    const formattedUsers = recentUsers.map((user) => ({
      id: user.id.toString(),
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
      role: user.role,
      joinedAt: user.created_at.toISOString(),
      status: user.is_active ? "active" : "pending",
    }));

    return respondWithSuccess({
      data: {
        recentUsers: formattedUsers,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch recent users",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
