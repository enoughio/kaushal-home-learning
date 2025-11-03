import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const currentDate = new Date();

    // Total collection = completed payments
    const totalCollectionResult = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: {
        payment_type: "FEE",
        status : "SUCCESS",
      },
    });

    // Due fees = fees that have crossed due date
    const dueFees = await prisma.feePayment.aggregate({
      _sum: { total_amount: true },
      where: {
        due_date: { lt: currentDate },
        status: "DUE",
      },
    });

    // Pending fees = fees due this month but not crossed due date
    const pendingFees = await prisma.feePayment.aggregate({
      _sum: { total_amount: true },
      where: {
        status: "DUE",
        due_date: { gte: currentDate },
      },
    });

    return respondWithSuccess({
      data: {
        totalCollection: Math.round(totalCollectionResult._sum?.amount || 0),
        dueFees: Math.round(dueFees._sum?.total_amount || 0),
        pendingFees: Math.round(pendingFees._sum?.total_amount || 0),
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
