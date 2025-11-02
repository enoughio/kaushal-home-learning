import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { AssignmentStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only students can access this endpoint",
        status: 403,
      });
    }

    const student = await prisma.students.findFirst({
      where: { user_id: user.id },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student profile not found",
        status: 404,
      });
    }

    const [pending, submitted, graded] = await Promise.all([
      prisma.assignments.count({
        where: {
          student_id: student.id,
          status: AssignmentStatus.ASSIGNED,
        },
      }),
      prisma.assignments.count({
        where: {
          student_id: student.id,
          status: AssignmentStatus.SUBMITTED,
        },
      }),
      prisma.assignments.count({
        where: {
          student_id: student.id,
          status: AssignmentStatus.GRADED,
        },
      }),
    ]);

    return respondWithSuccess({
      data: {
        pending,
        submitted,
        graded,
      },
      status: 200,
    });

  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch assignment statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
