import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";
import { validateAssignmentData } from "@/helper/validation";
import { uploadFile } from "@/helper/cloudinaryActions";

export async function GET(
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
    const assignment = await prisma.assignments.findFirst({
      where: {
        id: Number(assignmentId),
        teacher_id: Number(teacherId),
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        assignment_submissions: {
          include: {
            graded_by_teacher: {
              include: {
                user: true,
              },
            },
          },
        },
        assignment_attachments: true,
      },
    });

    if (!assignment) {
      return respondWithError({
        error: "ASSIGNMENT_NOT_FOUND",
        message: "Assignment not found or access denied",
        status: 404,
      });
    }

    const assignmentDetails = {
      id: assignment.id,
      studentId: assignment.student_id,
      studentName: `${assignment.student.user.first_name} ${assignment.student.user.last_name}`.trim(),
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.due_date,
      assignmentType: assignment.assignment_type,
      maxMarks: assignment.max_marks,
      instructions: assignment.instructions,
      grade: assignment.grade,
      status: assignment.status,
      attachments: assignment.assignment_attachments.filter(att => !att.is_submission).map(att => ({
        id: att.id,
        fileName: att.file_name,
        fileUrl: att.file_url,
        mimeType: att.mime_type,
        size: att.size,
      })),
      submission: assignment.assignment_submissions.length > 0 ? {
        id: assignment.assignment_submissions[0].id,
        submissionText: assignment.assignment_submissions[0].submission_text,
        submittedAt: assignment.assignment_submissions[0].submitted_at,
        marksObtained: assignment.assignment_submissions[0].marks_obtained,
        grade: assignment.assignment_submissions[0].grade,
        feedback: assignment.assignment_submissions[0].feedback,
        gradedAt: assignment.assignment_submissions[0].graded_at,
        gradedBy: assignment.assignment_submissions[0].graded_by_teacher
          ? `${assignment.assignment_submissions[0].graded_by_teacher.user.first_name} ${assignment.assignment_submissions[0].graded_by_teacher.user.last_name}`.trim()
          : null,
        isLate: assignment.assignment_submissions[0].is_late,
      } : null,
      createdAt: assignment.created_at,
      updatedAt: assignment.updated_at,
    };

    return respondWithSuccess({
      data: assignmentDetails,
    });
  } catch (error) {
    console.error("GET /teacher/assignments/:assignmentId error", error);
    return respondWithError({
      error: "ASSIGNMENT_FETCH_FAILED",
      message: "Unable to fetch assignment details",
      status: 500,
    });
  }
}

export async function PUT(
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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const dueDate = formData.get("dueDate") as string;
    const assignmentType = formData.get("assignmentType") as string;
    const maxMarks = formData.get("maxMarks") as string;
    const instructions = formData.get("instructions") as string;
    const files = formData.getAll("files") as File[];

    // Get existing assignment to validate ownership
    const existingAssignment = await prisma.assignments.findFirst({
      where: {
        id: Number(assignmentId),
        teacher_id: Number(teacherId),
      },
    });

    if (!existingAssignment) {
      return respondWithError({
        error: "ASSIGNMENT_NOT_FOUND",
        message: "Assignment not found or access denied",
        status: 404,
      });
    }

    // Check if assignment has been submitted - don't allow updates after submission
    const submission = await prisma.assignment_submissions.findFirst({
      where: { assignment_id: Number(assignmentId) },
    });

    if (submission) {
      return respondWithError({
        error: "ASSIGNMENT_ALREADY_SUBMITTED",
        message: "Cannot update assignment that has been submitted",
        status: 400,
      });
    }

    // Validate required fields
    const validation = validateAssignmentData({
      studentId: existingAssignment.student_id.toString(),
      title,
      subject,
      dueDate,
      maxMarks,
    });

    if (!validation.isValid) {
      return respondWithError({
        error: "VALIDATION_FAILED",
        message: validation.message || "Validation failed",
        status: 400,
      });
    }

    // Upload new files to Cloudinary if provided
    const attachmentPromises = files.map(async (file) => {
      const uploadResult = await uploadFile(file, "assignments");
      return {
        file_name: file.name,
        file_url: uploadResult.url,
        file_url_publicId: uploadResult.public_id,
        mime_type: file.type,
        size: file.size,
      };
    });

    const newAttachments = await Promise.all(attachmentPromises);

    // Update assignment in transaction
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignments.update({
        where: { id: Number(assignmentId) },
        data: {
          title,
          description: description || null,
          subject,
          due_date: dueDate ? new Date(dueDate) : null,
          assignment_type: assignmentType || null,
          max_marks: maxMarks ? Number(maxMarks) : 100,
          instructions: instructions || null,
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      // Add new attachment records if files were uploaded
      if (newAttachments.length > 0) {
        await tx.assignment_attachments.createMany({
          data: newAttachments.map(att => ({
            assignment_id: assignment.id,
            ...att,
          })),
        });
      }

      return assignment;
    });

    return respondWithSuccess({
      data: {
        id: result.id,
        studentId: result.student_id,
        studentName: `${result.student.user.first_name} ${result.student.user.last_name}`.trim(),
        title: result.title,
        description: result.description,
        subject: result.subject,
        dueDate: result.due_date,
        assignmentType: result.assignment_type,
        maxMarks: result.max_marks,
        instructions: result.instructions,
        status: result.status,
        updatedAt: result.updated_at,
      },
      message: "Assignment updated successfully",
    });
  } catch (error) {
    console.error("PUT /teacher/assignments/:assignmentId error", error);
    return respondWithError({
      error: "ASSIGNMENT_UPDATE_FAILED",
      message: "Unable to update assignment",
      status: 500,
    });
  }
}