import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { z } from "zod";
import { sendNotificationEmail } from "@/helper/mail/emailHelpers";

const idSchema = z
  .string({ message: "Assignment ID required" })
  .transform((id) => {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid assignment ID");
    }
    return parsedId;
  });

const gradeBodySchema = z.object({
  studentId: z
    .string()
    .transform((id) => {
      const parsedId = Number(id);
      if (isNaN(parsedId)) {
        throw new Error("Invalid student ID");
      }
      return parsedId;
    }),
  grade: z.string(),
  feedback: z.string(),
});

// grad an assignment add and update
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
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

    const data = await params;
    const assignmentId = idSchema.parse(data.assignmentId);

    const body = await req.json();
    const parsedBody = gradeBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "Invalid request body",
        details: parsedBody.error.issues,
        status: 400,
      });
    }

    const { studentId, grade, feedback } = parsedBody.data;

    const assignment = await prisma.assignments.findUnique({
      where: { id: assignmentId },
      select : {
        id : true, 
        title : true
      }
    });

    if (!assignment) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Assignment not found",
        status: 404,
      });
    }

    const submission = await prisma.assignment_submissions.updateMany({
      where: {
        assignment_id: assignmentId,
        student_id: studentId,
      },
      data: {
        grade,
        feedback,
      },
    });

    if (submission.count === 0) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Submission not found for the given student",
        status: 404,
      });
    }

    // Fetch the student's email
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select : {
            id :  true,
            first_name : true,
            last_name : true,
            email : true,
          }
        }, 
      },
    });

    if (!student || !student.user.email) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found or email not available",
        status: 404,
      });
    }

    // Send email notification to the student
    try {
      await sendNotificationEmail(student.user.email, {
        name: `${student.user.first_name} ${student.user.last_name}`,
        title: "Assignment Graded",
        message: `Your assignment titled "${assignment.title}" has been graded. Please check the portal for details on your grade and feedback.`,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/student/assignments`,
      });
    } catch (error) {
      console.error("Error in sending notification email:", error);
    }

    return respondWithSuccess({
      data: {
        message: "Assignment graded successfully",
        assignmentId: assignment.id.toString(),
        studentId,
      },
      status: 200,
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
