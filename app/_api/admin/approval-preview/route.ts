import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const pendingTeachers = await prisma.teachers.findMany({
      take: 5,
      where: {
        approval_status: "pending",
      },
      include: {
        user: true,
      },
      orderBy: { created_at: "asc" },
    });

    const formattedTeachers = pendingTeachers.map((teacher) => ({
      id: teacher.id.toString(),
      name: `${teacher.user.first_name || ""} ${teacher.user.last_name || ""}`.trim(),
      email: teacher.user.email,
      appliedAt: teacher.created_at.toISOString(),
      subjects: teacher.subjects_taught || [],
    }));

    return respondWithSuccess({
      data: {
        pendingTeachers: formattedTeachers,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch approval preview",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
