import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { getDistanceFromLatLonInKm } from "@/app/api/_lib/helper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
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

    const data = await params;
    const studentId = parseInt(data.studentId);

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
      where: { id: studentId, assigned_teacher_id: teacher.id },
      include: { user: true },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found or not assigned to this teacher",
        status: 404,
      });
    }
    // Validate teacher location against student home location using Haversine formula
    try {
      const distance = getDistanceFromLatLonInKm(
        location.latitude,
        location.longitude,
        student.user.home_latitude,
        student.user.home_longitude
      );

      if (distance <= 0.1) {
        console.log("✅ Valid location");
      } else {
        throw new Error(
          "Teacher is not within the valid location range of the student's home."
        );
      }
    } catch (error) {
      console.error("Location validation error:", error);
      return respondWithError({
        error: "INVALID_LOCATION",
        message:
          "Teacher is not within the valid location range of the student's home.",
        status: 400,
        details: error instanceof Error ? error.message : undefined,
      });
    }

    // Create or update attendance record
    const attendanceRecord = await prisma.attendance.create({
      data: {
        student_id: studentId,
        teacher_id: teacher.id,
        date: new Date(date),
        status,
        latitude: location?.latitude,
        longitude: location?.longitude,
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
