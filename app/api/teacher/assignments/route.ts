import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { AssignmentStatus, UserRole } from "@/generated/prisma";
import { uploadFile } from "@/helper/cloudinaryActions";
import { sendNotificationEmail } from "@/helper/mail/emailHelpers";
import { z } from "zod";


// get all the assignment by a teacher
export const GET = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req);

    if (!user || user.role != UserRole.teacher) {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 405,
      });
    }

    // check if teacher exists
    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      });
    }


    const assignments = await prisma.assignments.findMany({
      where: {
        teacher_id: teacher.id,
      },

      select: {
        id : true,
        student_id: true,
        title: true,
        description: true,
        teacher_id: true,
        due_date: true,
        status: true,
        created_at: true,

        student: {
          select: {
            id: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },

        teacher: {
          select: {
            id: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },

        assignment_submissions: {
          select: {
            id: true,
            grade: true,
            marks_obtained: true,
            feedback: true,
            submission_text: true,
          },
        },

        assignment_attachments: {
          select: {
            id: true,
            file_name: true,
            file_url: true,
            file_url_publicId: true,
            mime_type: true,
          },
        },
      },
    });


    return respondWithSuccess({
      data: assignments,
      message: "assignment fetched succesfully",
      status: 200,
    });
  } catch (error) {
    console.error("error in fetching assingments preview", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "error in fetching  data",
      status: 500,
    });
  }
};



// add an assignment
export const POST = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req);

    if (!user || user.role !== UserRole.teacher) {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Invalid teacher profile",
        status: 404,
      });
    }

    let formData: FormData;

    try {
      formData = await req.formData();
    } catch (error) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "Invalid form data",
        status: 400,
      });
    }

    const jsonData = formData.get("json");
    const fileData = formData.get("file");

    if (!jsonData || typeof jsonData !== "string") {
      return respondWithError({
        error: "BAD_REQUEST", 
        message: "Missing or invalid JSON data",
        status: 400,
      });
    }

    const schema = z.object({
      title: z.string().min(1, "Title is required"),
      studentId: z.number().int("Student ID must be an integer"),
      subject: z.string().min(1, "Subject is required"),
      dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Due date must be a valid date",
      }),
      description: z.string().optional(),
    });

    let data;
    try {
      data = schema.parse(JSON.parse(jsonData));

      // check if student belongs to teacher
      const student = await prisma.teacher_student_assignments.findFirst({
        where: {
          student_id: data.studentId,
          teacher_id : teacher.id,
        }
      })

      if(!student){
        return respondWithError({
          error: "BAD_REQUEST",
          message: "The specified student is not assigned to you",
          status: 400,
        });
      }


    } catch (error) {
      if (error instanceof z.ZodError) {
        return respondWithError({
          error: "BAD_REQUEST",
          message: "Validation error",
          details: error.issues, // Use 'issues' instead of 'errors'
          status: 400,
        });
      }
      return respondWithError({
        error: "BAD_REQUEST",
        message: "Unknown validation error",
        status: 400,
      });
    }

    if (fileData && !(fileData instanceof File)) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "Invalid file data",
        status: 400,
      });
    }

    if (fileData instanceof File && fileData.size > 20 * 1024 * 1024) {
      return respondWithError({
        error: "BAD_REQUEST",
        message: "File size exceeds the limit of 20MB",
        status: 400,
      });
    }

    let uploadResult: any = null;

    if (fileData instanceof File) {
      try {
        uploadResult = await uploadFile(fileData, "assignments");
      } catch (error) {
        return respondWithError({
          error: "UPLOAD_FAILED",
          message: "File upload failed. Please try again later",
          status: 500,
        });
      }
    }

    const assignmentData = await prisma.assignments.create({
      data: {
        teacher_id: teacher.id,
        student_id: data.studentId,
        title: data.title,
        description: data.description || null,
        status : AssignmentStatus.ASSIGNED,
        due_date: new Date(data.dueDate),

        assignment_attachments: uploadResult
          ? {
              create: {
                file_name: uploadResult.original_filename,
                file_url: uploadResult.url,
                file_url_publicId: uploadResult.public_id,
                mime_type: uploadResult.resource_type,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        due_date: true,
        description: true,
        teacher_id: true,
        student_id: true,

        student: {
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

        assignment_attachments: {
          select: {
            file_name: true,
            file_url: true,
            mime_type: true,
          },
        },
      },
    });

    // Ensure due_date is not null before calling toDateString
    const dueDateString = assignmentData.due_date
      ? assignmentData.due_date.toDateString()
      : "(no due date provided)";

    // Send email to the student about the new assignment
    try {
      await sendNotificationEmail(assignmentData.student.user.email, {
        name: `${assignmentData.student.user.first_name} ${assignmentData.student.user.last_name}`,
        title: "New Assignment Assigned",
        message: `A new assignment titled "${assignmentData.title}" has been assigned to you by your teacher. Please check the portal for more details and submit it by the due date: ${dueDateString}.`,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/student/assignments`,
      });
    } catch (error) {
      console.error("Error in sending notification email:", error);
    }

    return respondWithSuccess({
      data: {
        assignmentId: assignmentData.id,
        title: assignmentData.title,
        dueDate: assignmentData.due_date,
        description: assignmentData.description,
        teacherId: assignmentData.teacher_id,
        studentId: assignmentData.student_id,
        fileAttachment: uploadResult
          ? {
              fileName: uploadResult.original_filename,
              fileUrl: uploadResult.url,
              mimeType: uploadResult.resource_type,
            }
          : null,
      },
      message: "Assignment created successfully",
      status: 201,
    });
  } catch (error) {
    console.error("Error in creating assignment:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Error in creating assignment",
      status: 500,
    });
  }
};
