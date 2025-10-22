import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const studentId = searchParams.get("studentId");

  // Get teacher ID from auth header
  const teacherId = req.headers.get("x-user-id");
  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  // Validate month and year
  const currentDate = new Date();
  const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
  const targetYear = year ? parseInt(year) : currentDate.getFullYear();

  if (targetMonth < 1 || targetMonth > 12) {
    return respondWithError({
      error: "INVALID_MONTH",
      message: "Month must be between 1 and 12",
      status: 400,
    });
  }

  if (targetYear < 2000 || targetYear > currentDate.getFullYear() + 10) {
    return respondWithError({
      error: "INVALID_YEAR",
      message: "Invalid year",
      status: 400,
    });
  }

  const startDate = new Date(targetYear, targetMonth - 1, 1);
  const endDate = new Date(targetYear, targetMonth, 1);

  const where: any = {
    teacher_id: Number(teacherId),
    date: {
      gte: startDate,
      lt: endDate,
    },
  };

  if (studentId && !isNaN(Number(studentId))) {
    where.student_id = Number(studentId);
  }

  try {
    // Get attendance records for the month
    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    // Calculate statistics
    const totalDays = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.status === "present").length;
    const absentCount = attendanceRecords.filter(r => r.status === "absent").length;
    const lateCount = attendanceRecords.filter(r => r.status === "late").length;
    const excusedCount = attendanceRecords.filter(r => r.status === "excused").length;

    const attendancePercentage = totalDays > 0 ? ((presentCount + excusedCount) / totalDays) * 100 : 0;

    // Group by student
    const studentStats = attendanceRecords.reduce((acc, record) => {
      const studentId = record.student_id;
      if (!acc[studentId]) {
        acc[studentId] = {
          studentId,
          studentName: `${record.student.user.first_name} ${record.student.user.last_name}`.trim(),
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          attendancePercentage: 0,
        };
      }

      acc[studentId].totalClasses++;
      acc[studentId][record.status]++;

      return acc;
    }, {} as Record<number, any>);

    // Calculate percentages for each student
    Object.values(studentStats).forEach((stats: any) => {
      stats.attendancePercentage = stats.totalClasses > 0
        ? ((stats.present + stats.excused) / stats.totalClasses) * 100
        : 0;
    });

    // Daily breakdown
    const dailyStats = attendanceRecords.reduce((acc, record) => {
      const dateKey = record.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalStudents: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }

      acc[dateKey].totalStudents++;
      acc[dateKey][record.status]++;

      return acc;
    }, {} as Record<string, any>);

    return respondWithSuccess({
      data: {
        month: targetMonth,
        year: targetYear,
        summary: {
          totalDays,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        },
        studentStats: Object.values(studentStats),
        dailyStats: Object.values(dailyStats),
      },
    });
  } catch (error) {
    console.error("GET /teacher/attendance/monthly error", error);
    return respondWithError({
      error: "ATTENDANCE_STATS_FAILED",
      message: "Unable to fetch monthly attendance statistics",
      status: 500,
    });
  }
}