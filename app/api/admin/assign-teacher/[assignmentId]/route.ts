import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const { assignmentId: studentId } = params;

  if (!studentId || isNaN(Number(studentId))) {
    return respondWithError({
      error: "INVALID_STUDENT_ID",
      message: "Invalid student ID",
      status: 400,
    });
  }

  try {
    const body = await req.json();
    const { teacherId } = body;

    if (!teacherId || isNaN(Number(teacherId))) {
      return respondWithError({
        error: "INVALID_TEACHER_ID",
        message: "Valid teacher ID is required",
        status: 400,
      });
    }

    // Verify student exists and is active
    const student = await prisma.students.findFirst({
      where: {
        id: Number(studentId),
        is_active: true,
      },
    });

    if (!student) {
      return respondWithError({
        error: "STUDENT_NOT_FOUND",
        message: "Student not found or inactive",
        status: 404,
      });
    }

    // Check if student already has an assigned teacher
    if (student.assigned_teacher_id) {
      return respondWithError({
        error: "TEACHER_ALREADY_ASSIGNED",
        message: "Student already has an assigned teacher",
        status: 400,
      });
    }

    // Verify teacher exists and is approved
    const teacher = await prisma.teachers.findFirst({
      where: {
        id: Number(teacherId),
        approval_status: "approved",
        is_active: true,
      },
    });

    if (!teacher) {
      return respondWithError({
        error: "TEACHER_NOT_FOUND",
        message: "Teacher not found or not approved",
        status: 404,
      });
    }

    // Assign teacher to student
    await prisma.students.update({
      where: { id: Number(studentId) },
      data: { assigned_teacher_id: Number(teacherId) },
    });

    return respondWithSuccess({
      data: {
        studentId: Number(studentId),
        teacherId: Number(teacherId),
      },
      message: "Teacher assigned to student successfully",
    });
  } catch (error) {
    console.error("POST /admin/assign-teacher/:studentId error", error);
    return respondWithError({
      error: "ASSIGNMENT_FAILED",
      message: "Unable to assign teacher to student",
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const { assignmentId: studentId } = params;

  if (!studentId || isNaN(Number(studentId))) {
    return respondWithError({
      error: "INVALID_STUDENT_ID",
      message: "Invalid student ID",
      status: 400,
    });
  }

  try {
    const body = await req.json();
    const { teacherId } = body;

    if (!teacherId || isNaN(Number(teacherId))) {
      return respondWithError({
        error: "INVALID_TEACHER_ID",
        message: "Valid teacher ID is required",
        status: 400,
      });
    }

    // Verify student exists and is active
    const student = await prisma.students.findFirst({
      where: {
        id: Number(studentId),
        is_active: true,
      },
    });

    if (!student) {
      return respondWithError({
        error: "STUDENT_NOT_FOUND",
        message: "Student not found or inactive",
        status: 404,
      });
    }

    // Verify teacher exists and is approved
    const teacher = await prisma.teachers.findFirst({
      where: {
        id: Number(teacherId),
        approval_status: "approved",
        is_active: true,
      },
    });

    if (!teacher) {
      return respondWithError({
        error: "TEACHER_NOT_FOUND",
        message: "Teacher not found or not approved",
        status: 404,
      });
    }

    // Update assigned teacher
    await prisma.students.update({
      where: { id: Number(studentId) },
      data: { assigned_teacher_id: Number(teacherId) },
    });

    return respondWithSuccess({
      data: {
        studentId: Number(studentId),
        newTeacherId: Number(teacherId),
      },
      message: "Assigned teacher updated successfully",
    });
  } catch (error) {
    console.error("PUT /admin/assign-teacher/:studentId error", error);
    return respondWithError({
      error: "UPDATE_FAILED",
      message: "Unable to update assigned teacher",
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const { assignmentId: studentId } = params;

  if (!studentId || isNaN(Number(studentId))) {
    return respondWithError({
      error: "INVALID_STUDENT_ID",
      message: "Invalid student ID",
      status: 400,
    });
  }

  try {
    // Verify student exists and is active
    const student = await prisma.students.findFirst({
      where: {
        id: Number(studentId),
        is_active: true,
      },
    });

    if (!student) {
      return respondWithError({
        error: "STUDENT_NOT_FOUND",
        message: "Student not found or inactive",
        status: 404,
      });
    }

    // Remove assigned teacher
    await prisma.students.update({
      where: { id: Number(studentId) },
      data: { assigned_teacher_id: null },
    });

    return respondWithSuccess({
      data: {
        studentId: Number(studentId),
      },
      message: "Assigned teacher removed successfully",
    });
  } catch (error) {
    console.error("DELETE /admin/assign-teacher/:studentId error", error);
    return respondWithError({
      error: "REMOVAL_FAILED",
      message: "Unable to remove assigned teacher",
      status: 500,
    });
  }
}