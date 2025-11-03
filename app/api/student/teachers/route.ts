import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

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
      include: {
        assigned_teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student profile not found",
        status: 404,
      });
    }

    // Get all assigned teachers through teacher_student_assignments
    const teacherAssignments = await prisma.teacher_student_assignments.findMany({
      where: { student_id: student.id },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });

    const teachers = teacherAssignments.map((ta) => ({
      id: ta.teacher.id.toString(),
      name: `${ta.teacher.user.first_name || ""} ${ta.teacher.user.last_name || ""}`.trim(),
      email: ta.teacher.user.email,
      profileImg: ta.teacher.user.profile_image_url || "https://example.com/photo.jpg",
      phone: ta.teacher.user.phone || "",
      location: ta.teacher.user.location || "",
      subjects: ta.teacher.subjects_taught || [],
      status: ta.teacher.is_active ? "active" : "inactive",
      assignedAt: ta.assigned_date.toISOString(),
    }));

    return respondWithSuccess({
      data: {
        teachers,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch student teachers",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
