import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get all teachers and count students per subject
    const teachers = await prisma.teachers.findMany({
      select: {
        subjects_taught: true,
        assigned_students: {
          select: {
            id: true,
          },
        },
      },
    });

    const subjectDistribution: Record<string, number> = {};

    teachers.forEach((teacher) => {
      const studentCount = teacher.assigned_students.length;
      teacher.subjects_taught.forEach((subject) => {
        subjectDistribution[subject] =
          (subjectDistribution[subject] || 0) + studentCount;
      });
    });

    const result = Object.entries(subjectDistribution)
      .map(([subject, studentCount]) => ({
        subject,
        studentCount,
      }))
      .sort((a, b) => b.studentCount - a.studentCount);

    return respondWithSuccess({
      data: {
        subjectDistribution: result,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch subject distribution data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
