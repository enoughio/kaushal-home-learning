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

    const fee = await prisma.feePayment.findUnique({
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

    // Increment reminder count
    const updatedFee = await prisma.feePayment.update({
      where: { id: feeId },
      data: {
        reminder_sent: fee.reminder_sent + 1,
      },
    });

    // TODO: Send email reminder to student
    // This would integrate with nodemailer to send actual email

    return respondWithSuccess({
      data: {
        message: "Payment reminder sent successfully",
        feeId: fee.id.toString(),
        studentId: fee.student.id.toString(),
        studentName: `${fee.student.user.first_name || ""} ${fee.student.user.last_name || ""}`.trim(),
        dueDate: fee.due_date?.toISOString() || 0,
        ReminderSent: updatedFee.reminder_sent,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to send reminder",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
