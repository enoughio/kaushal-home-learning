import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

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

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get pending assignments
    const pendingAssignments = await prisma.assignments.count({
      where: {
        student_id: student.id,
        status: "assigned",
      },
    });

    // Get active teachers
    const activeTeachers = await prisma.teachers.count({
      where: {
        assigned_students: {
          some: {
            id: student.id,
          },
        },
        is_active: true,
      },
    });

    // Get attendance rate for current month
    const totalClasses = await prisma.attendance.count({
      where: {
        student_id: student.id,
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    const presentClasses = await prisma.attendance.count({
      where: {
        student_id: student.id,
        status: "present",
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    const attendanceRate =
      totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    return respondWithSuccess({
      data: {
        pendingAssignments,
        activeTeachers,
        attendanceRate,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch student stats",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
