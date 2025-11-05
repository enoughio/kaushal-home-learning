import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";


// get all assignments for a student
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only students can access this endpoint",
        status: 403,
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

    const assignments = await prisma.assignments.findMany({
      where: { student_id: student.id },

      select :{

        id : true,
        title : true,
        description : true,
        due_date : true,
        status : true,
        created_at : true,

      assignment_submissions : {
        select : {
          id : true,
          submitted_at : true,
          grade : true,
          feedback : true
        },
      },
      assignment_attachments : {
        select : {
          file_name : true,
          file_url : true,
          mime_type : true,
          size : true
        }
      },
      teacher : {
        select : {
          id : true,
          user : {
            select : {
              first_name : true,
              last_name : true
            }
          }
        }
      }
    },

      // orderBy: { created_at: "desc" },
    });

    const formattedAssignments = assignments.map((assignment) => {
      const submission = assignment.assignment_submissions[0];

      return{
        id: assignment.id.toString(),
        submited: assignment.assignment_submissions.length > 0,
        teacherId: assignment.teacher.id.toString(),
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
        submission: submission
          ? {
              submittedAt: submission.submitted_at.toISOString(),
              fileName: "",
              fileUrl: "",
              mimeType: "",
              size: 0,
              grade: submission.grade || null,
              feedback: submission.feedback || null,
            }
          : null, 
      }
    });

    return respondWithSuccess({
      data: {
        assignments: formattedAssignments,
      },
      message: "Assignments fetched successfully",
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
