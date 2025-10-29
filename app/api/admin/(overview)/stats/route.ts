import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const totalUsers = await prisma.users.count();
    const activeTeachers = await prisma.teachers.count({
      where: { is_active: true },
    });
    const totalStudents = await prisma.students.count();

    // Calculate total revenue from payments
    const totalRevenueData = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    });

    const totalRevenue = totalRevenueData._sum?.amount || 0;

    return respondWithSuccess({
      data: {
        totalUsers,
        activeTeachers,
        totalRevenue,
        TotalStudents: totalStudents,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch admin stats",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
