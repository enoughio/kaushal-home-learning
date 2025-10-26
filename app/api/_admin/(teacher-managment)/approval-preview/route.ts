import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";

export async function GET(req: NextRequest) {
  // Authentication and authorization are now handled by middleware
  // No need for requireRole check here

  try {
    const pending = await prisma.temp_users.findMany({
      where: { role: "teacher" },
      orderBy: { created_at: "desc" },
      include: {
        temp_teachers: true,
      },
      take: 10,
    });

    const pendingTeachers = pending.map((user) => {
      const profile = user.temp_teachers[0];
      return {
        tempUserId: user.id,
        fullName: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        phone: user.phone,
        city: user.city,
        createdAt: user.created_at,
        qualification: profile?.qualification ?? null,
        experienceYears: profile?.experience_years ?? null,
      };
    });

    return respondWithSuccess({
      data: { pendingTeachers },
    });
  } catch (error) {
    console.error("GET /admin/approval-preview error", error);
    return respondWithError({
      error: "APPROVAL_PREVIEW_FAILED",
      message: "Unable to fetch approval preview",
      status: 500,
    });
  }
}
