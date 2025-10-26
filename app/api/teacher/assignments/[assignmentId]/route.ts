import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export async function PATCH(
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
    const { title, description, dueDate, attachments } = body;

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

    // Update assignment
    await prisma.assignments.update({
      where: { id: assignmentId },
      data: {
        title: title || assignment.title,
        description: description || assignment.description,
        due_date: dueDate ? new Date(dueDate) : assignment.due_date,
      },
    });

    // Delete old attachments and add new ones if provided
    if (attachments && attachments.length > 0) {
      await prisma.assignment_attachments.deleteMany({
        where: { assignment_id: assignmentId },
      });

      await Promise.all(
        attachments.map((att: Record<string, unknown>) =>
          prisma.assignment_attachments.create({
            data: {
              assignment_id: assignmentId,
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
        message: "Assignment updated successfully",
        assignmentId: assignment.id.toString(),
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to update assignment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
