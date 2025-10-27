import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const currentYear = new Date().getFullYear();
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    const teacherGrouth = await Promise.all(
      months.map(async (month, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 1);

        const teachers = await prisma.teachers.count({
          where: {
            created_at: {
              gte: monthStart,
              lt: monthEnd,
            },
          },
        });

        return {
          month,
          teachers,
        };
      })
    );

    return respondWithSuccess({
      data: {
        teacherGrouth,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher growth data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
