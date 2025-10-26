import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

type PayFeePayload = {
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
};

export async function GET(req: NextRequest, { params }: { params: { feeId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const feeId = Number(params.feeId);
  if (!Number.isInteger(feeId) || feeId <= 0) {
    return respondWithError({
      error: "INVALID_FEE_ID",
      message: "Fee id must be a positive integer",
      status: 400,
    });
  }

  try {
    const fee = await prisma.student_fees.findUnique({
      where: { id: feeId },
      include: {
        student: {
          include: {
            user: true,
            payments: {
              where: { payment_type: "monthly_fee" },
              orderBy: { payment_date: "desc" },
            },
          },
        },
      },
    });

    if (!fee) {
      return respondWithError({
        error: "FEE_NOT_FOUND",
        message: "The requested fee does not exist",
        status: 404,
      });
    }

    const paymentHistory = fee.student.payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      paymentStatus: payment.payment_status,
      paymentDate: payment.payment_date,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      dueDate: payment.due_date,
      lateFee: payment.late_fee,
      discount: payment.discount,
      notes: payment.notes,
    }));

    return respondWithSuccess({
      data: {
        fee: {
          id: fee.id,
          studentId: fee.student_id,
          studentName: `${fee.student.user.first_name} ${fee.student.user.last_name}`.trim(),
          email: fee.student.user.email,
          phone: fee.student.user.phone,
          month: fee.month,
          year: fee.year,
          amount: fee.amount,
          dueDate: fee.due_date,
          status: fee.status,
          reminderSent: fee.reminder_sent,
          createdAt: fee.created_at,
          updatedAt: fee.updated_at,
        },
        paymentHistory,
      },
    });
  } catch (error) {
    console.error("GET /admin/student-fee/:feeId error", error);
    return respondWithError({
      error: "FEE_FETCH_FAILED",
      message: "Unable to fetch fee details",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest, { params }: { params: { feeId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const feeId = Number(params.feeId);
  if (!Number.isInteger(feeId) || feeId <= 0) {
    return respondWithError({
      error: "INVALID_FEE_ID",
      message: "Fee id must be a positive integer",
      status: 400,
    });
  }

  let payload: PayFeePayload;
  try {
    payload = await req.json();
  } catch (error) {
    return respondWithError({
      error: "INVALID_JSON",
      message: "Request body must be valid JSON",
      status: 400,
    });
  }

  const { paymentMethod, transactionId, notes } = payload;

  try {
    const fee = await prisma.student_fees.findUnique({
      where: { id: feeId },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    if (!fee) {
      return respondWithError({
        error: "FEE_NOT_FOUND",
        message: "The requested fee does not exist",
        status: 404,
      });
    }

    if (fee.status === "paid") {
      return respondWithError({
        error: "FEE_ALREADY_PAID",
        message: "This fee has already been paid",
        status: 409,
      });
    }

    const adminUser = requireRole(req, "admin");

    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payments.create({
        data: {
          student_id: fee.student_id,
          amount: fee.amount,
          payment_type: "monthly_fee",
          payment_method: paymentMethod,
          payment_status: "completed",
          transaction_id: transactionId,
          payment_date: new Date(),
          due_date: fee.due_date,
          notes,
          processed_by: adminUser.id,
        },
      });

      // Update fee status
      await tx.student_fees.update({
        where: { id: feeId },
        data: {
          status: "paid",
          updated_at: new Date(),
        },
      });

      return payment;
    });

    return respondWithSuccess({
      data: {
        paymentId: result.id,
        feeId,
        amount: result.amount,
        paymentDate: result.payment_date,
      },
      message: "Student fee marked as paid",
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("POST /admin/student-fee/:feeId/paid error", error);
    return respondWithError({
      error: "FEE_PAYMENT_FAILED",
      message: "Unable to process fee payment",
      status: 500,
    });
  }
}