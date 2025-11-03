import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { AssignmentStatus, UserRole } from "@/generated/prisma";

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
    });

    const data = assignments.map((asi) => {
      return {
        studentId: asi.student_id,
        title: asi.title,
        firstName: asi.student.user.first_name,
        lastName: asi.student.user.last_name,
        dueDate: asi.due_date,
        status: asi.status,
      };
    });

    return respondWithSuccess({
      data: data,
      message: "assignment fetched succesfully",
      status: 200,
    });
  } catch (error) {
    console.error("error in fetching assingments preview", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "error in fetching preview data",
      status: 500,
    });
  }
};

export const PUT = async (req: NextRequest) => {
  // Implementation for PUT request
};