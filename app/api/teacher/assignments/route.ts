import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";
import { validateAssignmentData } from "@/helper/validation";
import { uploadFile } from "@/helper/cloudinaryActions";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });
  const status = searchParams.get("status");
  const subject = searchParams.get("subject");

  // Get teacher ID from auth header
  const teacherId = req.headers.get("x-user-id");
  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  const where: any = { teacher_id: Number(teacherId) };
  if (status && ["assigned", "submitted", "graded", "overdue"].includes(status)) {
    where.status = status;
  }
  if (subject) {
    where.subject = subject;
  }

  try {
    const [total, assignments] = await Promise.all([
      prisma.assignments.count({ where }),
      prisma.assignments.findMany({
        where,
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
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const assignmentList = assignments.map((assignment) => ({
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
    }));

    return respondWithSuccess({
      data: {
        assignments: assignmentList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /teacher/assignments error", error);
    return respondWithError({
      error: "ASSIGNMENTS_FETCH_FAILED",
      message: "Unable to fetch assignments",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  const teacherId = req.headers.get("x-user-id");
  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  try {
    const formData = await req.formData();
    const studentId = formData.get("studentId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const dueDate = formData.get("dueDate") as string;
    const assignmentType = formData.get("assignmentType") as string;
    const maxMarks = formData.get("maxMarks") as string;
    const instructions = formData.get("instructions") as string;
    const files = formData.getAll("files") as File[];

    // Validate required fields
    const validation = validateAssignmentData({
      studentId,
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

    // Verify teacher-student assignment exists
    const teacherStudentAssignment = await prisma.teacher_student_assignments.findFirst({
      where: {
        teacher_id: Number(teacherId),
        student_id: Number(studentId),
        subject: subject,
      },
    });

    if (!teacherStudentAssignment) {
      return respondWithError({
        error: "INVALID_ASSIGNMENT",
        message: "Teacher is not assigned to this student for the specified subject",
        status: 400,
      });
    }

    // Upload files to Cloudinary if provided
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

    const attachments = await Promise.all(attachmentPromises);

    // Create assignment in transaction
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignments.create({
        data: {
          teacher_id: Number(teacherId),
          student_id: Number(studentId),
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

      // Create attachment records if files were uploaded
      if (attachments.length > 0) {
        await tx.assignment_attachments.createMany({
          data: attachments.map(att => ({
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
        createdAt: result.created_at,
      },
      message: "Assignment created successfully",
    });
  } catch (error) {
    console.error("POST /teacher/assignments error", error);
    return respondWithError({
      error: "ASSIGNMENT_CREATION_FAILED",
      message: "Unable to create assignment",
      status: 500,
    });
  }
}