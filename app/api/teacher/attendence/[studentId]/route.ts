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

    // only store last 6 months of attendance data
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const skip = (page - 1) * limit;

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

    const whereClause: Record<string, unknown> = {
      student_id: studentId,
      teacher_id: teacher.id,
    };

    if (month && year) {
      const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthEnd = new Date(parseInt(year), parseInt(month), 1);
      whereClause.date = {
        gte: monthStart,
        lt: monthEnd,
      };
    }

    const [attendance, totalRecords] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { date: "asc" },
      }),
      prisma.attendance.count({ where: whereClause }),
    ]);

    const attendanceRecords = attendance.map((att) => ({
      date: att.date.toISOString().split("T")[0],
      status: att.status,
    }));

    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const totalPages = Math.ceil(totalRecords / limit);

    return respondWithSuccess({
      data: {
        studentId: studentId.toString(),
        teacherId: teacher.id.toString(),
        month: currentMonth,
        year: currentYear,
        attendanceRecords,
        page,
        totalPages,
        totalRecords,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch attendance records",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
