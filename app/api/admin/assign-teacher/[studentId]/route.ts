import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";


import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";


// Define types for request and response
interface AssignTeacherRequest {
  teacherId: string;
}

// Define Prisma types for query results
type StudentWithUser = Prisma.studentsGetPayload<{
  include: { user: { select: { first_name: true; last_name: true } } };
}>;

type TeacherWithUser = Prisma.teachersGetPayload<{
  include: { user: { select: { first_name: true; last_name: true } } };
}>;

type AssignmentWithTeacher = Prisma.teacher_student_assignmentsGetPayload<{
  include: { teacher: { include: { user: { select: { first_name: true; last_name: true } } } } };
}>;


// Shared validation for student and teacher
async function validateStudentAndTeacher(
  studentId: number,
  teacherId: number | null
): Promise<
  { student: StudentWithUser; teacher: TeacherWithUser | null } | { error: Response }
> {
  const student = await prisma.students.findUnique({
    where: { id: studentId },
    include: { user: { select: { first_name: true, last_name: true } } },
  });

  if (!student) {
    return {
      error: respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      }),
    };
  }

  let teacher: TeacherWithUser | null = null;
  if (teacherId !== null) {
    teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
      include: { user: { select: { first_name: true, last_name: true } } },
    });
    if (!teacher) {
      return {
        error: respondWithError({
          error: "NOT_FOUND",
          message: "Teacher not found",
          status: 404,
        }),
      };
    }
    if (teacher.current_students >= teacher.max_students) {
      return {
        error: respondWithError({
          error: "INVALID_REQUEST",
          message: "Teacher has reached maximum student capacity",
          status: 400,
        }),
      };
    }
  }

  return { student, teacher };
}

// POST: Assign a teacher to a student
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {

    const data = await params;
    const studentId = parseInt(data.studentId);
    
    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    let body: AssignTeacherRequest;

    try {
      body = await req.json();
    } catch {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid request body",
        status: 400,
      });
    }

    const teacherId = parseInt(body.teacherId);
    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    const validationResult = await validateStudentAndTeacher(studentId, teacherId);
    if ("error" in validationResult) return validationResult.error;

    const { student, teacher } = validationResult;

    // Check for existing assignment
    const existingAssignment = await prisma.teacher_student_assignments.findFirst({
      where: {
        teacher_id: teacherId,
        student_id: studentId,
      },
    });

    if (existingAssignment) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Teacher already assigned to student",
        status: 400,
      });
    }

    // Create assignment and update teacher’s student count
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.teacher_student_assignments.create({
        data: {
          teacher_id: teacherId,
          student_id: studentId,
          assigned_by: authResult.payload.userId,
        },
      });
      await tx.teachers.update({
        where: { id: teacherId },
        data: { current_students: { increment: 1 } },
      });
      await tx.students.update({
        where: { id: studentId },
        data: { assigned_teacher_id: teacherId },
      });
      await tx.audit_logs.create({
        data: {
          user_id: authResult.payload.userId,
          action: "ASSIGN_TEACHER",
          table_name: "teacher_student_assignments",
          record_id: studentId,
          new_values: { teacherId },
        },
      });
    });

    return respondWithSuccess({
      data: {
        message: "Teacher assigned to student successfully",
        studentId: student.id.toString(),
        studentName: `${student.user.first_name || ""} ${student.user.last_name || ""}`.trim() || "Unknown",
        teacherId: teacherId.toString(),
        teacherName: `${teacher!.user.first_name || ""} ${teacher!.user.last_name || ""}`.trim() || "Unknown",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error assigning teacher:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to assign teacher",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// PUT: Update the assigned teacher for a student
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise <{ studentId: string }> }
) {
  try {
    
    const data =  await params;
    const studentId = parseInt(data.studentId);

    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    let body: AssignTeacherRequest;
    try {
      body = await req.json();
    } catch {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid request body",
        status: 400,
      });
    }

    const teacherId = parseInt(body.teacherId);
    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    const validationResult = await validateStudentAndTeacher(studentId, teacherId);
    if ("error" in validationResult) return validationResult.error;

    const { student, teacher } = validationResult;

    // Check for existing assignment
    const existingAssignment = await prisma.teacher_student_assignments.findFirst({
      where: {
        student_id : studentId,
        teacher_id: teacherId,
      },
    });

    if (existingAssignment) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Teacher already assigned to student",
        status: 400,
      });
    }

    // Update assignment and teacher student counts
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete existing assignment (if any)
      const oldAssignment = await tx.teacher_student_assignments.findFirst({
        where: { student_id: studentId },
      });
      if (oldAssignment) {
        await tx.teacher_student_assignments.delete({
          where: {
            id: oldAssignment.id,
          },
        });
        await tx.teachers.update({
          where: { id: oldAssignment.teacher_id },
          data: { current_students: { decrement: 1 } },
        });
      }
      // Create new assignment
      await tx.teacher_student_assignments.create({
        data: {
          teacher_id: teacherId,
          student_id: studentId,
          assigned_by: authResult.payload.userId,
        },
      });
      await tx.teachers.update({
        where: { id: teacherId },
        data: { current_students: { increment: 1 } },
      });
      await tx.students.update({
        where: { id: studentId },
        data: { assigned_teacher_id: teacherId },
      });
      await tx.audit_logs.create({
        data: {
          user_id: authResult.payload.userId,
          action: "UPDATE_TEACHER_ASSIGNMENT",
          table_name: "teacher_student_assignments",
          record_id: studentId,
          old_values: oldAssignment ? { teacherId: oldAssignment.teacher_id } : undefined,
          new_values: { teacherId },
        },
      });
    });

    return respondWithSuccess({
      data: {
        message: "Assigned teacher updated successfully",
        studentId: student.id.toString(),
        studentName: `${student.user.first_name || ""} ${student.user.last_name || ""}`.trim() || "Unknown",
        teacherId: teacherId.toString(),
        teacherName: `${teacher!.user.first_name || ""} ${teacher!.user.last_name || ""}`.trim() || "Unknown",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating teacher assignment:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to update teacher assignment",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}



// DELETE: Remove the assigned teacher from a student
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const data = await params;
    const studentId = parseInt(data.studentId);

    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const validationResult = await validateStudentAndTeacher(studentId, null);
    if ("error" in validationResult) return validationResult.error;

    const { student } = validationResult;

    // Check for existing assignment
    const existingAssignment: AssignmentWithTeacher | null =
      await prisma.teacher_student_assignments.findFirst({
        where: { student_id: studentId },
        include: {
          teacher: { include: { user: { select: { first_name: true, last_name: true } } } },
        },
      });

    if (!existingAssignment) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "No teacher assigned to this student",
        status: 404,
      });
    }

    // Delete assignment and update teacher student count
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.teacher_student_assignments.delete({
        where: {
          id: existingAssignment.id,
        },
      });
      await tx.teachers.update({
        where: { id: existingAssignment.teacher_id },
        data: { current_students: { decrement: 1 } },
      });
      await tx.students.update({
        where: { id: studentId },
        data: { assigned_teacher_id: null },
      });
      await tx.audit_logs.create({
        data: {
          user_id: authResult.payload.userId,
          action: "REMOVE_TEACHER_ASSIGNMENT",
          table_name: "teacher_student_assignments",
          record_id: studentId,
          old_values: { teacherId: existingAssignment.teacher_id },
        },
      });
    });

    return respondWithSuccess({
      data: {
        message: "Assigned teacher removed successfully",
        studentId: student.id.toString(),
        studentName: `${student.user.first_name || ""} ${student.user.last_name || ""}`.trim() || "Unknown",
        teacherId: existingAssignment.teacher_id.toString(),
        teacherName: `${existingAssignment.teacher.user.first_name || ""} ${existingAssignment.teacher.user.last_name || ""}`.trim() || "Unknown",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error removing teacher assignment:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to remove teacher assignment",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}