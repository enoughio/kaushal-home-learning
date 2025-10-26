import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  const { assignmentId } = params;
  const teacherId = req.headers.get("x-user-id");

  if (!assignmentId || isNaN(Number(assignmentId))) {
    return respondWithError({
      error: "INVALID_ASSIGNMENT_ID",
      message: "Invalid assignment ID",
      status: 400,
    });
  }

  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  try {
    const body = await req.json();
    const { marksObtained, grade, feedback } = body;

    // Validate input
    if (marksObtained === undefined || marksObtained === null) {
      return respondWithError({
        error: "MARKS_REQUIRED",
        message: "Marks obtained is required",
        status: 400,
      });
    }

    if (isNaN(Number(marksObtained)) || Number(marksObtained) < 0) {
      return respondWithError({
        error: "INVALID_MARKS",
        message: "Marks obtained must be a non-negative number",
        status: 400,
      });
    }

    if (grade && typeof grade !== "string") {
      return respondWithError({
        error: "INVALID_GRADE",
        message: "Grade must be a string",
        status: 400,
      });
    }

    if (feedback && typeof feedback !== "string") {
      return respondWithError({
        error: "INVALID_FEEDBACK",
        message: "Feedback must be a string",
        status: 400,
      });
    }

    // Verify assignment exists and belongs to teacher
    const assignment = await prisma.assignments.findFirst({
      where: {
        id: Number(assignmentId),
        teacher_id: Number(teacherId),
      },
      include: {
        assignment_submissions: true,
      },
    });

    if (!assignment) {
      return respondWithError({
        error: "ASSIGNMENT_NOT_FOUND",
        message: "Assignment not found or access denied",
        status: 404,
      });
    }

    // Check if assignment has been submitted
    if (assignment.assignment_submissions.length === 0) {
      return respondWithError({
        error: "NO_SUBMISSION",
        message: "Assignment has not been submitted yet",
        status: 400,
      });
    }

    const submission = assignment.assignment_submissions[0];

    // Check if already graded
    if (submission.graded_at) {
      return respondWithError({
        error: "ALREADY_GRADED",
        message: "Assignment has already been graded",
        status: 400,
      });
    }

    // Validate marks don't exceed max marks
    if (Number(marksObtained) > assignment.max_marks) {
      return respondWithError({
        error: "MARKS_EXCEED_MAX",
        message: `Marks obtained (${marksObtained}) cannot exceed maximum marks (${assignment.max_marks})`,
        status: 400,
      });
    }

    // Grade the assignment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update submission with grade
      const updatedSubmission = await tx.assignment_submissions.update({
        where: { id: submission.id },
        data: {
          marks_obtained: Number(marksObtained),
          grade: grade || null,
          feedback: feedback || null,
          graded_at: new Date(),
          graded_by: Number(teacherId),
        },
        include: {
          graded_by_teacher: {
            include: {
              user: true,
            },
          },
        },
      });

      // Update assignment status to graded
      await tx.assignments.update({
        where: { id: Number(assignmentId) },
        data: {
          status: "graded",
          grade: grade || null,
        },
      });

      return updatedSubmission;
    });

    return respondWithSuccess({
      data: {
        submissionId: result.id,
        marksObtained: result.marks_obtained,
        grade: result.grade,
        feedback: result.feedback,
        gradedAt: result.graded_at,
        gradedBy: result.graded_by_teacher
          ? `${result.graded_by_teacher.user.first_name} ${result.graded_by_teacher.user.last_name}`.trim()
          : null,
      },
      message: "Assignment graded successfully",
    });
  } catch (error) {
    console.error("POST /teacher/assignments/:assignmentId/grade error", error);
    return respondWithError({
      error: "GRADING_FAILED",
      message: "Unable to grade assignment",
      status: 500,
    });
  }
}