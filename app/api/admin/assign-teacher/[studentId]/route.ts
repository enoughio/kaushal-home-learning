import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = parseInt(params.studentId);

    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const body = await req.json();
    const { teacherId } = body;

    if (!teacherId) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "teacherId is required",
        status: 400,
      });
    }

    const student = await prisma.students.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      });
    }

    const teacher = await prisma.teachers.findUnique({
      where: { id: parseInt(teacherId) },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    const updatedStudent = await prisma.students.update({
      where: { id: studentId },
      data: {
        assigned_teacher_id: parseInt(teacherId),
      },
    });

    return respondWithSuccess({
      data: {
        message: "Teacher assigned to student successfully",
        studentId: student.id.toString(),
        teacherId: teacherId,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to assign teacher",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = parseInt(params.studentId);

    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const body = await req.json();
    const { teacherId } = body;

    if (!teacherId) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "teacherId is required",
        status: 400,
      });
    }

    const student = await prisma.students.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      });
    }

    const teacher = await prisma.teachers.findUnique({
      where: { id: parseInt(teacherId) },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    await prisma.students.update({
      where: { id: studentId },
      data: {
        assigned_teacher_id: parseInt(teacherId),
      },
    });

    return respondWithSuccess({
      data: {
        message: "Assigned teacher updated successfully",
        studentId: student.id.toString(),
        newTeacherId: teacherId,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to update teacher assignment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = parseInt(params.studentId);

    if (isNaN(studentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      });
    }

    const student = await prisma.students.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      });
    }

    await prisma.students.update({
      where: { id: studentId },
      data: {
        assigned_teacher_id: null,
      },
    });

    return respondWithSuccess({
      data: {
        message: "Assigned teacher removed successfully",
        studentId: student.id.toString(),
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to remove teacher assignment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
