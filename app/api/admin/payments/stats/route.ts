import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

export async function GET(req: NextRequest) {
  try {

    const authResult = await authenticateAndValidateAdmin(req)
    if( "error" in authResult) return authResult.error

    const totalPaymentsCount = await prisma.payments.count();
    const duePayments = await prisma.payments.count({
      where: {
        payment_status: "pending",
      },
    });

    const paidResult = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: { payment_status: "completed" },
    });

    const dueResult = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: { payment_status: "pending" },
    });

    return respondWithSuccess({
      data: {
        totalPayments: totalPaymentsCount,
        duePayments,
        paidAmmount: Math.round(paidResult._sum?.amount || 0),
        dueAmmount: Math.round(dueResult._sum?.amount || 0),
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch payment statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
