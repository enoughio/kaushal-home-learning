import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only students can access this endpoint",
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "File is required",
        status: 400,
      });
    }

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

    // TODO: Upload file to Cloudinary and get URL
    const fileUrl = `https://example.com/${file.name}`;

    // Create or update submission
    let submission = await prisma.assignment_submissions.findFirst({
      where: {
        assignment_id: assignmentId,
        student_id: student.id,
      },
    });

    if (!submission) {
      submission = await prisma.assignment_submissions.create({
        data: {
          assignment_id: assignmentId,
          student_id: student.id,
          submitted_at: new Date(),
        },
      });
    } else {
      submission = await prisma.assignment_submissions.update({
        where: { id: submission.id },
        data: {
          submitted_at: new Date(),
        },
      });
    }

    // Create attachment record for submission
    await prisma.assignment_attachments.create({
      data: {
        assignment_id: assignmentId,
        file_name: file.name,
        file_url: fileUrl,
        mime_type: file.type,
        size: file.size,
        is_submission: true,
      },
    });

    return respondWithSuccess({
      data: {
        message: "Submission uploaded successfully",
        assignmentId: assignment.id.toString(),
        studentId: student.id.toString(),
        fileName: file.name,
        fileUrl,
        submittedAt: new Date().toISOString(),
      },
      status: 201,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to submit assignment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
