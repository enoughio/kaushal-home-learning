import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get total student fees
    const studentFeesResult = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: {
        payment_type: "monthly_fee",
        payment_status: "completed",
      },
    });

    // Get total teacher salaries
    const teacherSalariesResult = await prisma.salary_payments.aggregate({
      _sum: { total_amount: true },
      where: {
        payment_status: "completed",
      },
    });

    const studentFees = studentFeesResult._sum?.amount || 0;
    const teacherSalaries = teacherSalariesResult._sum?.total_amount || 0;
    const total = studentFees + teacherSalaries;

    const studentFeesPercentage =
      total > 0 ? Math.round((studentFees / total) * 100) : 0;
    const teacherSalariesPercentage =
      total > 0 ? Math.round((teacherSalaries / total) * 100) : 0;

    const paymentDistribution = [
      { type: "Student Fees", amount: studentFeesPercentage },
      { type: "Teacher Salaries", amount: teacherSalariesPercentage },
    ];

    return respondWithSuccess({
      data: {
        paymentDistribution,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch payment distribution data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
