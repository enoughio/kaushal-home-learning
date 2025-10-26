import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
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

    const body = await req.json();
    const { studentId, title, subject, description, dueDate, attachments } = body;

    if (!studentId || !title) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "studentId and title are required",
        status: 400,
      });
    }

    const student = await prisma.students.findUnique({
      where: { id: parseInt(studentId) },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      });
    }

    // Create assignment
    const assignment = await prisma.assignments.create({
      data: {
        teacher_id: teacher.id,
        student_id: parseInt(studentId),
        title,
        subject: subject || "",
        description,
        due_date: dueDate ? new Date(dueDate) : null,
        status: "assigned",
      },
    });

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      await Promise.all(
        attachments.map((att: Record<string, unknown>) =>
          prisma.assignment_attachments.create({
            data: {
              assignment_id: assignment.id,
              file_name: att.fileName as string,
              file_url: att.fileUrl as string,
              mime_type: att.mimeType as string,
              size: att.size as number,
              is_submission: false,
            },
          })
        )
      );
    }

    return respondWithSuccess({
      data: {
        message: "Assignment created successfully",
        assignmentId: assignment.id.toString(),
        studentId,
      },
      status: 201,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to create assignment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
