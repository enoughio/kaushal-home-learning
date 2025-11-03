import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const currentYear = new Date().getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const userGrowth = await Promise.all(
      months.map(async (month, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 1);

        const studentsCount = await prisma.students.count({
          where: {
            created_at: {
              gte: monthStart,
              lt: monthEnd,
            },
          },
        });

        const teachersCount = await prisma.teachers.count({
          where: {
            created_at: {
              gte: monthStart,
              lt: monthEnd,
            },
          },
        });

        return {
          month,
          students: studentsCount,
          teachers: teachersCount,
        };
      })
    );

    return respondWithSuccess({
      data: {
        userGrowth,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch user growth data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
