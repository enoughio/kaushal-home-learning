import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { teacherId: string } }
) {
  try {
    const teacherId = parseInt(params.teacherId);

    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    // Find the teacher
    const teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    // Update teacher approval status
    const updatedTeacher = await prisma.teachers.update({
      where: { id: teacherId },
      data: {
        approval_status: "approved",
      },
    });

    return respondWithSuccess({
      data: {
        message: "Teacher approved successfully",
        teacherId: teacher.id.toString(),
        teacherName: `${teacher.user.first_name} ${teacher.user.last_name}`,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to approve teacher",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
