import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { uploadFile, UploadResult } from "@/helper/cloudinaryActions";
import { AssignmentStatus } from "@/generated/prisma";
import { sendNotificationEmail } from "@/helper/mail/emailHelpers";
import { z } from "zod";

const idSchema = z.string().transform((id) => {
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid assignment ID");
  }
  return parsedId;
});

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, "File size should not exceed 10MB"),
  type: z.string(),
});

// submit an assignment for a student
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    console.log("Submission endpoint hit");
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only students can access this endpoint",
        status: 403,
      });
    }

    const data = await params;
    const assignmentId = idSchema.parse(data.assignmentId);

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
    const text  = formData.get("json") as File;
    const textData = JSON.parse(text as unknown as string); // Replaced `any` with `unknown` for better type safety



    if (file) {
    

    const parsedFile = fileSchema.safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!parsedFile.success) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "Invalid file",
        details: parsedFile.error.issues,
        status: 400,
      });
    } 

    }

    const assignment = await prisma.assignments.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        title: true,
        teacher: {
          select: {
            user: {
              select: {
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Assignment not found",
        status: 404,
      });
    }

    let uploadResult: unknown;
    if(file ){
      try {
        uploadResult = await uploadFile(file, "assignments");
      } catch (error) {
      return respondWithError({
        error: "UPLOAD_FAILED",
        message: "File upload failed. Please try again later",
        status: 500,
      });
    }
  }

    // Create submission
     await prisma.assignment_submissions.create({
      data: {
        assignment_id: assignmentId,
        student_id: student.id,
        submission_text : textData || "",
        submitted_at: new Date(),
        file_name: file ? file.name : null,
        // file_name: file.name || null,
        file_url: uploadResult.url || null,
        file_url_publicId: uploadResult.public_id || null,
        mime_type: file.type,
      },
    });

    // Update assignment status
    await prisma.assignments.update({
      where: { id: assignmentId },
      data: { status: AssignmentStatus.SUBMITTED },
    });

    // Send email notification to teacher
    try {
      await sendNotificationEmail(assignment.teacher.user.email, {
        name: `${assignment.teacher.user.first_name} ${assignment.teacher.user.last_name}`,
        title: "New Assignment Submission",
        message: `The assignment titled "${assignment.title}" has been submitted. Please review the submission at your earliest convenience.`,
      });
    } catch (error) {
      console.error("Failed to send email notification to teacher:", error);
    }

    return respondWithSuccess({
      data: {
        message: "Submission uploaded successfully",
      },
      status: 201,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: errorMessage,
      status: 500,
    });
  }
}
