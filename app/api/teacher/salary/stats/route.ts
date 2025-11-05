import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { SalaryStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

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

    // Get total earnings
    const earningsResult = await prisma.salaryPayment.aggregate({
      _sum: { total_amount: true },
      where: {
        teacherId: teacher.id,
        status: SalaryStatus.PAID,
      },
    });


    const totalSalaryCnt = await prisma.salaryPayment.aggregate({
      where: {
        teacherId: teacher.id,
        status: SalaryStatus.PAID,
      },
      _count: { id: true },
    });

    return respondWithSuccess({
      data: {
        totalEarnings: Math.round(earningsResult._sum?.total_amount || 0),
        totalPays: totalSalaryCnt._count.id || "",
        },
      status: 200,
    });
  
  } catch (error) {

    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch salary statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
