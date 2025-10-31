import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

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
    const earningsResult = await prisma.salary_payments.aggregate({
      _sum: { total_amount: true },
      where: {
        teacher_id: teacher.id,
        payment_status: "completed",
      },
    });

    // Get pending salaries
    const pendingResult = await prisma.salary_payments.aggregate({
      _sum: { total_amount: true },
      where: {
        teacher_id: teacher.id,
        payment_status: "pending",
      },
    });

    const lastPaidSalary = await prisma.salary_payments.findFirst({
      where: {
        teacher_id: teacher.id,
        payment_status: "completed",
      },
      orderBy: { payment_date: "desc" },
    });

    return respondWithSuccess({
      data: {
        totalEarnings: Math.round(earningsResult._sum?.total_amount || 0),
        pendingSalaries: Math.round(pendingResult._sum?.total_amount || 0),
        salaryDetails: {
          baseSalary: teacher.monthly_salary,
          bonus: 0,
          totalSalary: teacher.monthly_salary,
          lastPaidMonth: lastPaidSalary
            ? new Date(lastPaidSalary.created_at).toLocaleString("default", {
                month: "short",
              })
            : "N/A",
          lastPaidDate: lastPaidSalary?.payment_date?.toISOString() || "",
        },
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
