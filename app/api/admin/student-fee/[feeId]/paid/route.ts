// pay fee

import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { generateTransactionId } from "@/app/api/_lib/helper";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";
import { FeeStatus, PaymentMethod, PaymentStatus, PaymentType } from "@/generated/prisma";;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ feeId: string }> }
) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const data = await params;
    const entityId = parseInt(data.feeId);

    const body = await req.json();
    const { paymentMethod, transactionId: transactionIdRaw, date, amount } = body;

    let transactionId = transactionIdRaw || generateTransactionId();

    const fee = await prisma.feePayment.findUnique({
      where: { id: entityId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    // if fee entity not found then create one
    if (!fee) {
      const payment = await prisma.payments.create({
        data: {
          status: PaymentStatus.SUCCESS,
          amount: amount,
          payment_type: PaymentType.FEE,
          payment_method: PaymentMethod.CASH,
          transactionId: transactionId,
          payment_date: new Date(date),
          processedBy: {
            connect: { id: authResult.payload.userId },
          },

          feePayment: {
            create: {
              paidAt: new Date(date),
              total_amount: amount,
              due_date: new Date(date),
              status: FeeStatus.PAID, 
              student: {
                connect: {
                  id: entityId, // Left as-is per original logic
                },
              },
            },
          },
        },
      });

      return respondWithSuccess({
        data: {
          message: "Fee paid and entry created successfully",
          paymentId: payment.id.toString(),
        },
        status: 200,
      });
    }

    const { feeResult, paymentResult } = await prisma.$transaction(async (prisma) => {
      const feeResult = await prisma.feePayment.update({
        where: { id: fee.id },
        data: {
          status: FeeStatus.PAID, // Fixed: use enum
          paidAt: new Date(date),
          total_amount: amount,
        },
      });

      const paymentResult = await prisma.payments.create({
        data: {
          feePayment: {
            connect: {
              id: fee.id,
            },
          },
          amount: amount,
          payment_type: PaymentType.FEE,
          payment_method: paymentMethod,
          transactionId: transactionId,
          payment_date: new Date(date),
          status: PaymentStatus.SUCCESS,
          notes: "Manual Entry",
          processedBy: {
            connect: { id: authResult.payload.userId }, // Fixed: use relation connect
          },
        },
      });

      return { feeResult, paymentResult };
    });

    return respondWithSuccess({
      data: {
        message: "Fee payment recorded successfully",
        feeId: fee.id.toString(),
        paymentDetails: {
          paymentMethod,
          transactionId,
          date,
          amount,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to create fee payment entry",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}