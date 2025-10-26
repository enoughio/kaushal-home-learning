import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
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

    const assignmentId = parseInt(params.assignmentId);

    if (isNaN(assignmentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid assignment ID",
        status: 400,
      });
    }

    const body = await req.json();
    const { studentId, grade, feedback } = body;

    const assignment = await prisma.assignments.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Assignment not found",
        status: 404,
      });
    }

    // Update submission with grade and feedback
    const submission = await prisma.assignment_submissions.updateMany({
      where: {
        assignment_id: assignmentId,
        student_id: parseInt(studentId),
      },
      data: {
        grade,
        feedback,
        graded_at: new Date(),
        graded_by: user.id,
      },
    });

    // TODO: Send email notification to student

    return respondWithSuccess({
      data: {
        message: "Assignment updated successfully",
        assignmentId: assignment.id.toString(),
        studentId,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to grade assignment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
