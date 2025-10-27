import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get current year and past 4 years
    const currentYear = new Date().getFullYear();
    const years = [
      currentYear - 4,
      currentYear - 3,
      currentYear - 2,
      currentYear - 1,
      currentYear,
    ];

    const annualRevenue = await Promise.all(
      years.map(async (year) => {
        const result = await prisma.payments.aggregate({
          _sum: { amount: true },
          where: {
            payment_date: {
              gte: new Date(year, 0, 1),
              lt: new Date(year + 1, 0, 1),
            },
            payment_status: "completed",
          },
        });
        return {
          label: year.toString(),
          value: result._sum?.amount ? Math.round(result._sum.amount / 1000) : 0, // In thousands
        };
      })
    );

    return respondWithSuccess({
      data: {
        annualRevenue,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch annual revenue data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
