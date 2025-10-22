import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "student");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    return getAttendanceStats(req);
  }

  // Default: list attendance records
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });
  const teacherId = searchParams.get("teacherId");
  const date = searchParams.get("date");
  const subject = searchParams.get("subject");

  // Get student ID from auth header
  const studentId = req.headers.get("x-user-id");
  if (!studentId) {
    return respondWithError({
      error: "STUDENT_ID_MISSING",
      message: "Student ID not found in request",
      status: 400,
    });
  }

  const where: any = { student_id: Number(studentId) };
  if (teacherId && !isNaN(Number(teacherId))) {
    where.teacher_id = Number(teacherId);
  }
  if (date) {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      where.date = dateObj;
    }
  }
  if (subject) {
    where.subject = subject;
  }

  try {
    const [total, attendanceRecords] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.findMany({
        where,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const attendanceList = attendanceRecords.map((record) => ({
      id: record.id,
      teacherId: record.teacher_id,
      teacherName: `${record.teacher.user.first_name} ${record.teacher.user.last_name}`.trim(),
      date: record.date,
      status: record.status,
      subject: record.subject,
      sessionDuration: record.session_duration,
      notes: record.notes,
      markedAt: record.marked_at,
    }));

    return respondWithSuccess({
      data: {
        attendance: attendanceList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /student/attendance error", error);
    return respondWithError({
      error: "ATTENDANCE_FETCH_FAILED",
      message: "Unable to fetch attendance records",
      status: 500,
    });
  }
}

async function getAttendanceStats(req: NextRequest) {
  const studentId = req.headers.get("x-user-id");
  if (!studentId) {
    return respondWithError({
      error: "STUDENT_ID_MISSING",
      message: "Student ID not found in request",
      status: 400,
    });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

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

  try {
    // Get attendance records for the month
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        student_id: Number(studentId),
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // Calculate statistics
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.status === "present").length;
    const absentCount = attendanceRecords.filter(r => r.status === "absent").length;
    const lateCount = attendanceRecords.filter(r => r.status === "late").length;
    const excusedCount = attendanceRecords.filter(r => r.status === "excused").length;

    const attendancePercentage = totalClasses > 0 ? ((presentCount + excusedCount) / totalClasses) * 100 : 0;

    // Group by subject
    const subjectStats = attendanceRecords.reduce((acc, record) => {
      const subject = record.subject || "General";
      if (!acc[subject]) {
        acc[subject] = {
          subject,
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          attendancePercentage: 0,
        };
      }

      acc[subject].totalClasses++;
      acc[subject][record.status]++;

      return acc;
    }, {} as Record<string, any>);

    // Calculate percentages for each subject
    Object.values(subjectStats).forEach((stats: any) => {
      stats.attendancePercentage = stats.totalClasses > 0
        ? ((stats.present + stats.excused) / stats.totalClasses) * 100
        : 0;
    });

    return respondWithSuccess({
      data: {
        month: targetMonth,
        year: targetYear,
        summary: {
          totalClasses,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        },
        subjectStats: Object.values(subjectStats),
      },
    });
  } catch (error) {
    console.error("GET /student/attendance/stats error", error);
    return respondWithError({
      error: "ATTENDANCE_STATS_FAILED",
      message: "Unable to fetch attendance statistics",
      status: 500,
    });
  }
}