import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { RecentUserResponse } from "@/lib/types";

export async function GET() {
  try {
    // Fetch recent users with only required fields
    const recentUsers = await prisma.users.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        created_at: true,
        is_active: true,
      },
      take: 10,
      orderBy: { created_at: "desc" },
    });

    // Format users for the response
    const formattedUsers: RecentUserResponse[] = recentUsers.map((user) => ({
      id: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
      role: user.role,
      joinedAt: user.created_at.toISOString(),
      status: user.is_active ? "active" : "inactive",
      isActive: user.is_active,
      createdAt: user.created_at.toISOString(),
    }));

    return respondWithSuccess({
      data: {
        recentUsers: formattedUsers,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch recent users",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
