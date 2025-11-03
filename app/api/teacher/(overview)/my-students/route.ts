import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";

export const GET = async (req : NextRequest) => {
  try {
    const user = getAuthUser(req);

    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    const students = await prisma.students.findMany({
      where: {
        assigned_teacher: {
          user: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            gender: true,
          },
        },
      },
    });

    return respondWithSuccess({
      data: {
        students: students,
      },
      status: 200,
    });
  } catch {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      status: 500,
    });
  }
};
