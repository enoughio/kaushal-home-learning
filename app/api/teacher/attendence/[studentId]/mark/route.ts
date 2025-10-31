import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

export async function POST(
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

    const body = await req.json();
    const { date, status, location } = body;

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

    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      });
    }

    // TODO: Validate teacher location against student home location using geolocation API

    // Create or update attendance record
    const attendanceRecord = await prisma.attendance.upsert({
      where: {
        student_id_teacher_id_date_subject: {
          student_id: studentId,
          teacher_id: teacher.id,
          date: new Date(date),
          subject: "", // Default empty subject
        },
      },
      create: {
        student_id: studentId,
        teacher_id: teacher.id,
        date: new Date(date),
        status,
        latitude: location?.latitude,
        longitude: location?.longitude,
        marked_by: user.id,
      },
      update: {
        status,
        latitude: location?.latitude,
        longitude: location?.longitude,
        marked_at: new Date(),
        marked_by: user.id,
      },
    });

    return respondWithSuccess({
      data: {
        message: "Attendance marked successfully",
        studentId: student.id.toString(),
        teacherId: teacher.id.toString(),
        date,
        status,
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark attendance",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
