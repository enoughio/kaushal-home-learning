import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";
import { uploadFile } from "@/helper/cloudinaryActions";

export async function POST(
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
    const formData = await req.formData();
    const submissionText = formData.get("submissionText") as string;
    const files = formData.getAll("files") as File[];

    // Validate input
    if (!submissionText && files.length === 0) {
      return respondWithError({
        error: "SUBMISSION_REQUIRED",
        message: "Either submission text or files are required",
        status: 400,
      });
    }

    if (submissionText && submissionText.length > 5000) {
      return respondWithError({
        error: "SUBMISSION_TOO_LONG",
        message: "Submission text must not exceed 5000 characters",
        status: 400,
      });
    }

    // Verify assignment exists and belongs to student
    const assignment = await prisma.assignments.findFirst({
      where: {
        id: Number(assignmentId),
        student_id: Number(studentId),
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

    // Check if already submitted
    if (assignment.assignment_submissions.length > 0) {
      return respondWithError({
        error: "ALREADY_SUBMITTED",
        message: "Assignment has already been submitted",
        status: 400,
      });
    }

    // Check if overdue
    const isLate = assignment.due_date ? new Date() > assignment.due_date : false;

    // Upload submission files to Cloudinary if provided
    const attachmentPromises = files.map(async (file) => {
      const uploadResult = await uploadFile(file, "assignment_submissions");
      return {
        file_name: file.name,
        file_url: uploadResult.url,
        file_url_publicId: uploadResult.public_id,
        mime_type: file.type,
        size: file.size,
        is_submission: true,
      };
    });

    const submissionAttachments = await Promise.all(attachmentPromises);

    // Submit assignment in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create submission
      const submission = await tx.assignment_submissions.create({
        data: {
          assignment_id: Number(assignmentId),
          student_id: Number(studentId),
          submission_text: submissionText || null,
          is_late: isLate,
        },
      });

      // Create attachment records if files were uploaded
      if (submissionAttachments.length > 0) {
        await tx.assignment_attachments.createMany({
          data: submissionAttachments.map(att => ({
            assignment_id: Number(assignmentId),
            ...att,
          })),
        });
      }

      // Update assignment status
      await tx.assignments.update({
        where: { id: Number(assignmentId) },
        data: { status: "submitted" },
      });

      return submission;
    });

    return respondWithSuccess({
      data: {
        submissionId: result.id,
        submittedAt: result.submitted_at,
        isLate: result.is_late,
      },
      message: "Assignment submitted successfully",
    });
  } catch (error) {
    console.error("POST /student/assignments/:assignmentId/submit error", error);
    return respondWithError({
      error: "SUBMISSION_FAILED",
      message: "Unable to submit assignment",
      status: 500,
    });
  }
}