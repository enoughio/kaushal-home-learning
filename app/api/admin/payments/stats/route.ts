import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    // get current month
    const month = new Date().getMonth();

    const totalPaymentDone = await prisma.payments.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    });

    const totalFeesRecived = await prisma.feePayment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });

    // this will only work if cron job is working
    const totalDueFee = await prisma.feePayment.aggregate({
      _sum: { amount: true },
      where: { status: "DUE" },
    });

    const totalSalaryPaid = await prisma.salaryPayment.aggregate({
      _sum: { total_amount: true },
      where: { status: "PAID" },
    });

    return respondWithSuccess({
      data: {
        totalPayments: Number(totalPaymentDone._sum.amount ?? 0), // total money that went through Payments
        SalaryPaid: Number(totalSalaryPaid._sum.total_amount), // fees actually collected
        dueAmount: Number(totalDueFee._sum.amount), // fees still owed
        feeRecived: Number(totalFeesRecived._sum.amount), // salaries already paid
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
