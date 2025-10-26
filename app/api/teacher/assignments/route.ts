import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
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

    const assignments = await prisma.assignments.findMany({
      where: { teacher_id: teacher.id },
      include: {
        assignment_attachments: true,
        assignment_submissions: true,
      },
      orderBy: { created_at: "desc" },
    });

    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id.toString(),
      studentId: assignment.student_id.toString(),
      title: assignment.title,
      description: assignment.description || "",
      dueDate: assignment.due_date?.toISOString() || "",
      createdAt: assignment.created_at.toISOString(),
      status: assignment.status,
      attachments: assignment.assignment_attachments.map((att) => ({
        fileName: att.file_name || "",
        fileUrl: att.file_url || "",
        mimeType: att.mime_type || "",
        size: att.size || 0,
      })),
      submissions: assignment.assignment_submissions.map((sub) => ({
        studentId: assignment.student_id.toString(),
        submittedAt: sub.submitted_at.toISOString(),
        fileName: "", // This would need to be stored in attachments table
        fileUrl: "",
        mimeType: "",
        size: 0,
        grade: sub.grade || null,
        feedback: sub.feedback || null,
      })),
    }));

    return respondWithSuccess({
      data: {
        assignments: formattedAssignments,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch assignments",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
