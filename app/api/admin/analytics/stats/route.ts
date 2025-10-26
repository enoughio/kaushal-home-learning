import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const monthlyGrowth = await prisma.users.count({
      where: {
        created_at: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    const newTeachersThisMonth = await prisma.teachers.count({
      where: {
        created_at: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    const newStudentsThisMonth = await prisma.students.count({
      where: {
        created_at: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    const revenueResult = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: {
        payment_date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
        payment_status: "completed",
      },
    });

    const revenueThisMonth = revenueResult._sum?.amount || 0;

    const activeUsers = await prisma.users.count({
      where: { is_active: true },
    });

    return respondWithSuccess({
      data: {
        monthlygrouth: monthlyGrowth,
        newTeachersThisMonth,
        newStudentsThisMonth,
        revenueThisMonth,
        activeUsers,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch analytics stats",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
