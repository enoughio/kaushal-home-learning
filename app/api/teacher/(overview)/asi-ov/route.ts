import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { AssignmentStatus, UserRole } from "@/generated/prisma";

export const GET = async (req: NextRequest) => {
  try {
    // === 1. Authentication ===
    const user = getAuthUser(req);

    if (!user || user.role !== UserRole.teacher) {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    // === 2. Get teacher profile ===
    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      });
    }

    // === 3. Fetch pending assignments (status = ASSIGNED) ===
    const assignments = await prisma.assignments.findMany({
      where: {
        teacher_id: teacher.id,
        status: AssignmentStatus.ASSIGNED,
      },
      select: {
        student_id: true,
        title: true,
        due_date: true,
        status: true,
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
      },
      orderBy: {
        due_date: "asc",
      },
    });

    // === 4. Transform data to match frontend expectations ===
    const data = assignments.map((assignment) => ({
      studentId: assignment.student_id,
      title: assignment.title,
      firstName: assignment.student.user.first_name,
      lastName: assignment.student.user.last_name,
      dueDate: assignment.due_date,
      status: assignment.status,
    }));

    return respondWithSuccess({
      data: data,
      message: "Pending assignments fetched successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching pending assignments:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch pending assignments",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
};

export const PUT = async () => {
  return respondWithError({
    error: "NOT_IMPLEMENTED",
    message: "PUT method is not implemented yet",
    status: 501,
  });
};