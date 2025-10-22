import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";
import { sendFeeReminderEmail } from "@/helper/mail/emailHelpers";

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
        message: "Cannot send reminder for already paid fee",
        status: 400,
      });
    }

    // Update reminder count
    const updatedFee = await prisma.student_fees.update({
      where: { id: feeId },
      data: {
        reminder_sent: { increment: 1 },
        updated_at: new Date(),
      },
    });

    // Send email reminder
    try {
      await sendFeeReminderEmail(fee.student.user.email, {
        studentName: `${fee.student.user.first_name} ${fee.student.user.last_name}`.trim(),
        month: fee.month,
        year: fee.year,
        amount: fee.amount,
        dueDate: fee.due_date,
        reminderCount: updatedFee.reminder_sent,
      });
    } catch (emailError) {
      console.error("Failed to send fee reminder email", emailError);
      // Don't fail the request if email fails, just log it
    }

    return respondWithSuccess({
      data: {
        feeId,
        reminderSent: updatedFee.reminder_sent,
        dueDate: fee.due_date,
      },
      message: "Fee reminder sent successfully",
    });
  } catch (error) {
    console.error("POST /admin/student-fee/:feeId/send-reminder error", error);
    return respondWithError({
      error: "REMINDER_SEND_FAILED",
      message: "Unable to send fee reminder",
      status: 500,
    });
  }
}