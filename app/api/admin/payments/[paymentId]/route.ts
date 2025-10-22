import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const { paymentId } = params;

  if (!paymentId || isNaN(Number(paymentId))) {
    return respondWithError({
      error: "INVALID_PAYMENT_ID",
      message: "Invalid payment ID",
      status: 400,
    });
  }

  try {
    const payment = await prisma.payments.findUnique({
      where: { id: Number(paymentId) },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        processed_by_user: true,
      },
    });

    if (!payment) {
      return respondWithError({
        error: "PAYMENT_NOT_FOUND",
        message: "Payment not found",
        status: 404,
      });
    }

    const paymentDetails = {
      id: payment.id,
      studentId: payment.student_id,
      studentName: `${payment.student.user.first_name} ${payment.student.user.last_name}`.trim(),
      studentEmail: payment.student.user.email,
      parentName: payment.student.parent_name,
      parentEmail: payment.student.parent_email,
      amount: payment.amount,
      paymentType: payment.payment_type,
      paymentStatus: payment.payment_status,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      paymentDate: payment.payment_date,
      dueDate: payment.due_date,
      lateFee: payment.late_fee,
      discount: payment.discount,
      notes: payment.notes,
      processedBy: payment.processed_by_user
        ? `${payment.processed_by_user.first_name} ${payment.processed_by_user.last_name}`.trim()
        : null,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at,
    };

    return respondWithSuccess({
      data: paymentDetails,
    });
  } catch (error) {
    console.error("GET /admin/payments/:paymentId error", error);
    return respondWithError({
      error: "PAYMENT_FETCH_FAILED",
      message: "Unable to fetch payment details",
      status: 500,
    });
  }
}