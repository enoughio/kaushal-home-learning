import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
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

    const attendenceTrend = await Promise.all(
      months.map(async (month, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 1);

        const totalClasses = await prisma.attendance.count({
          where: {
            date: {
              gte: monthStart,
              lt: monthEnd,
            },
          },
        });

        const presentClasses = await prisma.attendance.count({
          where: {
            date: {
              gte: monthStart,
              lt: monthEnd,
            },
            status: "present",
          },
        });

        const attendanceRate =
          totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

        return {
          month,
          attendanceRate,
        };
      })
    );

    return respondWithSuccess({
      data: {
        attendenceTrend,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch attendance trend data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
