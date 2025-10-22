import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError } from "@/app/api/_lib/http";
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
  const { searchParams } = new URL(req.url);
  const attachmentId = searchParams.get("attachmentId");

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

  if (!attachmentId || isNaN(Number(attachmentId))) {
    return respondWithError({
      error: "INVALID_ATTACHMENT_ID",
      message: "Valid attachment ID is required",
      status: 400,
    });
  }

  try {
    // Verify assignment belongs to student and attachment exists
    const attachment = await prisma.assignment_attachments.findFirst({
      where: {
        id: Number(attachmentId),
        assignment_id: Number(assignmentId),
        assignment: {
          student_id: Number(studentId),
        },
      },
    });

    if (!attachment) {
      return respondWithError({
        error: "ATTACHMENT_NOT_FOUND",
        message: "Attachment not found or access denied",
        status: 404,
      });
    }

    if (!attachment.file_url) {
      return respondWithError({
        error: "FILE_URL_MISSING",
        message: "File URL is not available",
        status: 404,
      });
    }

    // Fetch the file from Cloudinary URL
    const response = await fetch(attachment.file_url);

    if (!response.ok) {
      return respondWithError({
        error: "FILE_FETCH_FAILED",
        message: "Unable to fetch file from storage",
        status: 500,
      });
    }

    const fileBuffer = await response.arrayBuffer();

    // Return file with appropriate headers
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": attachment.mime_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${attachment.file_name}"`,
        "Content-Length": attachment.size?.toString() || "0",
      },
    });
  } catch (error) {
    console.error("GET /student/assignments/:assignmentId/download error", error);
    return respondWithError({
      error: "DOWNLOAD_FAILED",
      message: "Unable to download file",
      status: 500,
    });
  }
}