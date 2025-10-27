import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const paymentId = parseInt(params.paymentId);

    if (isNaN(paymentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid payment ID",
        status: 400,
      });
    }

    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Payment not found",
        status: 404,
      });
    }

    return respondWithSuccess({
      data: {
        id: payment.id.toString(),
        userId: payment.student.user_id.toString(),
        userName: `${payment.student.user.first_name || ""} ${payment.student.user.last_name || ""}`.trim(),
        type: payment.payment_type,
        amount: payment.amount,
        status: payment.payment_status,
        date: payment.payment_date?.toISOString() || new Date().toISOString(),
        dueDate: payment.due_date?.toISOString() || new Date().toISOString(),
        method: payment.payment_method || "cash",
        transactionId: payment.transaction_id || "",
        UserDetails: {
          id: payment.student.user_id.toString(),
          name: `${payment.student.user.first_name || ""} ${payment.student.user.last_name || ""}`.trim(),
          email: payment.student.user.email,
          profileImg: payment.student.user.profile_image_url || "https://example.com/photo.jpg",
          phone: payment.student.user.phone || "",
          location: payment.student.user.location || "",
          role: payment.student.user.role,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch payment details",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
