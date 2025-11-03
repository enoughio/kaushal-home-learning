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

    const studentGrowth = await Promise.all(
      months.map(async (month, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 1);

        const students = await prisma.students.count({
          where: {
            created_at: {
              gte: monthStart,
              lt: monthEnd,
            },
          },
        });

        return {
          month,
          students,
        };
      })
    );

    return respondWithSuccess({
      data: {
        studentGrowth,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch student growth data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
