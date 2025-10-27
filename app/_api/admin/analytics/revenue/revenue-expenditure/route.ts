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

    const revenueExpenditure = await Promise.all(
      months.map(async (month, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 1);

        // Revenue = completed student fees payments
        const revenueResult = await prisma.payments.aggregate({
          _sum: { amount: true },
          where: {
            payment_date: {
              gte: monthStart,
              lt: monthEnd,
            },
            payment_status: "completed",
            payment_type: "monthly_fee",
          },
        });

        // Expenditure = completed teacher salary payments
        const expenditureResult = await prisma.salary_payments.aggregate({
          _sum: { total_amount: true },
          where: {
            payment_date: {
              gte: monthStart,
              lt: monthEnd,
            },
            payment_status: "completed",
          },
        });

        const revenue = revenueResult._sum?.amount
          ? Math.round(revenueResult._sum.amount / 1000)
          : 0;
        const expenditure = expenditureResult._sum?.total_amount
          ? Math.round(expenditureResult._sum.total_amount / 1000)
          : 0;

        return {
          month,
          revenue,
          expenditure,
        };
      })
    );

    return respondWithSuccess({
      data: {
        revenueExpenditure,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch revenue vs expenditure data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
