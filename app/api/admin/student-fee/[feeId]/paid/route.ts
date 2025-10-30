import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { feeId: string } }
) {
  try {
    const feeId = parseInt(params.feeId);

    if (isNaN(feeId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid fee ID",
        status: 400,
      });
    }

    const body = await req.json();
    const { paymentMethod, transactionId, date } = body;

    const fee = await prisma.feePayment.findUnique({
      where: { id: feeId },
    });

    if (!fee) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Fee not found",
        status: 404,
      });
    }

    // Create payment entry
    await prisma.payments.create({
      data: {
        student_id: fee.student_id,
        amount: fee.amount,
        payment_type: "monthly_fee",
        payment_method: paymentMethod,
        payment_status: "completed",
        transaction_id: transactionId,
        payment_date: new Date(date),
      },
    });

    // Update fee status to paid
    await prisma.student_fees.update({
      where: { id: feeId },
      data: {
        status: "paid",
      },
    });

    return respondWithSuccess({
      data: {
        message: "Fee marked as paid successfully",
        feeId: fee.id.toString(),
        paymentDetails: {
          paymentMethod,
          transactionId,
          date,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark fee as paid",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
