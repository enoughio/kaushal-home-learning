import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(
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

    const fee = await prisma.student_fees.findUnique({
      where: { id: feeId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!fee) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Fee not found",
        status: 404,
      });
    }

    // Get payment history for this fee
    const payments = await prisma.payments.findMany({
      where: {
        student_id: fee.student_id,
        payment_type: "monthly_fee",
      },
      orderBy: { created_at: "desc" },
    });

    const paymentHistory = payments.map((payment) => ({
      paymentId: payment.id.toString(),
      amount: payment.amount,
      date: payment.payment_date?.toISOString() || "",
      method: payment.payment_method || "cash",
      transactionId: payment.transaction_id || "",
    }));

    return respondWithSuccess({
      data: {
        id: fee.id.toString(),
        studentId: fee.student.id.toString(),
        studentName: `${fee.student.user.first_name || ""} ${fee.student.user.last_name || ""}`.trim(),
        studentEmail: fee.student.user.email,
        profileImg: fee.student.user.profile_image_url || "https://example.com/photo.jpg",
        phone: fee.student.user.phone || "",
        location: fee.student.user.location || "",
        feeDetails: {
          fee: fee.amount,
          status: fee.status,
          date: fee.created_at.toISOString(),
          dueDate: fee.due_date.toISOString(),
          ReminderSent: fee.reminder_sent,
        },
        paymentHistory,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch fee details",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
