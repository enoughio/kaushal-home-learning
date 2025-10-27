import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    const studentId = parseInt(params.studentId);

    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      });
    }

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 1);

    const attendance = await prisma.attendance.findMany({
      where: {
        student_id: studentId,
        teacher_id: teacher.id,
        date: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      orderBy: { date: "asc" },
    });

    const attendanceRecords = attendance.map((att) => ({
      date: att.date.toISOString().split("T")[0],
      status: att.status,
    }));

    return respondWithSuccess({
      data: {
        studentId: studentId.toString(),
        teacherId: teacher.id.toString(),
        month: currentDate.toLocaleString("default", { month: "long" }),
        year,
        attendanceRecords,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch monthly attendance",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
