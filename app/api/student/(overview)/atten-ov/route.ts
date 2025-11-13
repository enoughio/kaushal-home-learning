import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

// Returns recent attendance records for the authenticated student
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

    // Fetch recent attendance - limit to recent 10 records
    const recentAttendance = await prisma.attendance.findMany({
      where: { student_id: student.id },
      orderBy: { date: "desc" },
      take: 10,
      select: {
        id: true,
        student_id: true,
        teacher_id: true,
        subject: true,
        date: true,
        status: true,
        session_duration: true,
        // include teacher -> user to build a teacher name
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    const payload = recentAttendance.map((r) => ({
      id: r.id.toString(),
      studentId: r.student_id?.toString() ?? null,
      teacherId: r.teacher_id?.toString() ?? null,
      teacherName:
        r.teacher && r.teacher.user
          ? `${r.teacher.user.first_name ?? ""} ${r.teacher.user.last_name ?? ""}`.trim()
          : null,
      subject: r.subject ?? null,
      date: r.date ? r.date.toISOString() : null,
      // normalize enum to lowercase string
      status: typeof r.status === "string" ? r.status.toLowerCase() : null,
      duration: r.session_duration ?? null,
    }));

    return respondWithSuccess({
      data: payload,
      message: "Recent attendance fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching recent attendance:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      status: 500,
    });
  }
}
// create this route to handle attendance overview of theacher for student overview dashboard
