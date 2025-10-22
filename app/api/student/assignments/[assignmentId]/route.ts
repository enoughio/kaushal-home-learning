import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    requireRole(req, "student");
  } catch (error) {
    return error as Response;
  }

  const { assignmentId } = params;
  const studentId = req.headers.get("x-user-id");

  if (!assignmentId || isNaN(Number(assignmentId))) {
    return respondWithError({
      error: "INVALID_ASSIGNMENT_ID",
      message: "Invalid assignment ID",
      status: 400,
    });
  }

  if (!studentId) {
    return respondWithError({
      error: "STUDENT_ID_MISSING",
      message: "Student ID not found in request",
      status: 400,
    });
  }

  try {
    const assignment = await prisma.assignments.findFirst({
      where: {
        id: Number(assignmentId),
        student_id: Number(studentId),
      },
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
        assignment_submissions: true,
        assignment_attachments: true,
      },
    });

    if (!assignment) {
      return respondWithError({
        error: "ASSIGNMENT_NOT_FOUND",
        message: "Assignment not found or access denied",
        status: 404,
      });
    }

    const submission = assignment.assignment_submissions[0];
    const isOverdue = assignment.due_date && new Date() > assignment.due_date && assignment.status !== "submitted" && assignment.status !== "graded";

    const assignmentDetails = {
      id: assignment.id,
      teacherId: assignment.teacher_id,
      teacherName: `${assignment.teacher.user.first_name} ${assignment.teacher.user.last_name}`.trim(),
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.due_date,
      assignmentType: assignment.assignment_type,
      maxMarks: assignment.max_marks,
      instructions: assignment.instructions,
      status: isOverdue ? "overdue" : assignment.status,
      attachments: assignment.assignment_attachments.filter(att => !att.is_submission).map(att => ({
        id: att.id,
        fileName: att.file_name,
        fileUrl: att.file_url,
        mimeType: att.mime_type,
        size: att.size,
      })),
      submission: submission ? {
        id: submission.id,
        submissionText: submission.submission_text,
        submittedAt: submission.submitted_at,
        marksObtained: submission.marks_obtained,
        grade: submission.grade,
        feedback: submission.feedback,
        gradedAt: submission.graded_at,
        isLate: submission.is_late,
      } : null,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at,
    };

    return respondWithSuccess({
      data: assignmentDetails,
    });
  } catch (error) {
    console.error("GET /student/assignments/:assignmentId error", error);
    return respondWithError({
      error: "ASSIGNMENT_FETCH_FAILED",
      message: "Unable to fetch assignment details",
      status: 500,
    });
  }
}