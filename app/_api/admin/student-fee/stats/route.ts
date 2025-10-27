import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const currentDate = new Date();

    // Total collection = completed payments
    const totalCollectionResult = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: {
        payment_type: "monthly_fee",
        payment_status: "completed",
      },
    });

    // Due fees = fees that have crossed due date
    const dueFees = await prisma.student_fees.aggregate({
      _sum: { amount: true },
      where: {
        due_date: { lt: currentDate },
        status: "due",
      },
    });

    // Pending fees = fees due this month but not crossed due date
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const pendingFees = await prisma.student_fees.aggregate({
      _sum: { amount: true },
      where: {
        month: currentMonth,
        year: currentYear,
        status: "due",
        due_date: { gte: currentDate },
      },
    });

    return respondWithSuccess({
      data: {
        totalCollection: Math.round(totalCollectionResult._sum?.amount || 0),
        dueFees: Math.round(dueFees._sum?.amount || 0),
        pendingFees: Math.round(pendingFees._sum?.amount || 0),
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch student fee statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
