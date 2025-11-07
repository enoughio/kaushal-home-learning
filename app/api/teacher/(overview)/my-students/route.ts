import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export const GET = async (req: NextRequest) => {
  try {
    // === 1. Authentication ===
    const user = getAuthUser(req);

    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    // === 2. Get teacher profile ===
    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      });
    }

    // === 3. Fetch students assigned to teacher ===
    const students = await prisma.students.findMany({
      where: {
        assigned_teacher_id: teacher.id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            gender: true,
          },
        },
      },
      orderBy: {
        enrollment_date: "desc",
      },
    });

    return respondWithSuccess({
      data: {
        students: students,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching teacher students:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
};
