import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import z from "zod";

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
    const pagesSchema = z.coerce.number().int({ message: "Page must be an integer" }).min(1, {message : "page must be positive"}).default(1);

    const searchParams = req.nextUrl.searchParams;
    const page = pagesSchema.parse(searchParams.get("page"));

    const limit = 20;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const skip = (page - 1) * limit;

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

    const whereClause: Record<string, unknown> = {
      student_id: student.id,
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
        studentId: student.id.toString(),
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
