import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const token = req.cookies.get("auth-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return respondWithError({
        error: "UNAUTHENTICATED",
        message: "Authentication required",
        status: 401,
      });
    }

    let userRole: string | null = null;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      userRole = (payload as any).role;
    } catch (error) {
      return respondWithError({
        error: "INVALID_TOKEN",
        message: "Invalid or expired token",
        status: 401,
      });
    }

    if (userRole !== "admin") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Admin access required",
        status: 403,
      });
    }

    // Get recent users
    const recentUsers = await prisma.users.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      take: 5,
    });

    // Format recent users
    const formattedRecentUsers = recentUsers.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
    }));

    return respondWithSuccess({
      data: formattedRecentUsers,
      message: "Successfully fetched recent user data",
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching recent users:", error);
    return respondWithError({
      error: "ERROR_FETCHING_RECENT_USERS",
      message: "An error occurred while fetching recent user data.",
      status: 500,
    });
  }
}
