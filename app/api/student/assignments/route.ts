import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "student");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });
  const status = searchParams.get("status");
  const subject = searchParams.get("subject");

  // Get student ID from auth header
  const studentId = req.headers.get("x-user-id");
  if (!studentId) {
    return respondWithError({
      error: "STUDENT_ID_MISSING",
      message: "Student ID not found in request",
      status: 400,
    });
  }

  const where: any = { student_id: Number(studentId) };
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
          teacher: {
            include: {
              user: true,
            },
          },
          assignment_submissions: true,
          assignment_attachments: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const assignmentList = assignments.map((assignment) => {
      const submission = assignment.assignment_submissions[0];
      const isOverdue = assignment.due_date && new Date() > assignment.due_date && assignment.status !== "submitted" && assignment.status !== "graded";

      return {
        id: assignment.id,
        teacherId: assignment.teacher_id,
        teacherName: `${assignment.teacher.user.first_name} ${assignment.teacher.user.last_name}`.trim(),
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        dueDate: assignment.due_date,
        assignmentType: assignment.assignment_type,
        maxMarks: assignment.max_marks,
        instructions: assignment.instructions,
        status: isOverdue ? "overdue" : assignment.status,
        attachments: assignment.assignment_attachments.filter(att => !att.is_submission).map(att => ({
          id: att.id,
          fileName: att.file_name,
          fileUrl: att.file_url,
          mimeType: att.mime_type,
          size: att.size,
        })),
        submission: submission ? {
          id: submission.id,
          submittedAt: submission.submitted_at,
          marksObtained: submission.marks_obtained,
          grade: submission.grade,
          feedback: submission.feedback,
          gradedAt: submission.graded_at,
          isLate: submission.is_late,
        } : null,
        createdAt: assignment.created_at,
      };
    });

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
    console.error("GET /student/assignments error", error);
    return respondWithError({
      error: "ASSIGNMENTS_FETCH_FAILED",
      message: "Unable to fetch assignments",
      status: 500,
    });
  }
}