import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { FeeStatus } from "@/generated/prisma";

interface ReminderRequestBody {
  studentId?: number;
}

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
          select: {
            id: true,
            monthly_fee: true,
            fee_due_date: true,
            last_fee_payment_date: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    let updatedFee;
    if (!fee) {
      // If fee entity not found, create one
      const body: ReminderRequestBody = await req.json();
      const { studentId } = body;

      if (!studentId) {
        return respondWithError({
          error: "INVALID_REQUEST",
          message: "Student ID is required to create a fee record",
          status: 400,
        });
      }

      const student = await prisma.students.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          monthly_fee: true,
          fee_due_date: true,
          last_fee_payment_date: true,
          user: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      });

      if (!student) {
        return respondWithError({
          error: "NOT_FOUND",
          message: "Student not found",
          status: 404,
        });
      }

      updatedFee = await prisma.feePayment.create({
        data: {
          total_amount: student.monthly_fee,
          due_date: student.fee_due_date,
          status: FeeStatus.DUE,
          reminder_sent: 1,
          student: {
            connect: {
              id: student.id,
            },
          },
        },
      });
    } else {
      // Increment reminder count for existing fee
      updatedFee = await prisma.feePayment.update({
        where: { id: feeId },
        data: {
          reminder_sent: fee.reminder_sent + 1,
        },
      });
    }

    // TODO: Integrate email service to send reminders
    // Example: await sendEmailReminder(studentEmail, templateData);

    return respondWithSuccess({
      data: {
        message: "Payment reminder sent successfully",
        feeId: updatedFee.id.toString(),
        studentId: updatedFee.studentId.toString(),
        studentName: `${fee?.student?.user?.first_name || ""} ${
          fee?.student?.user?.last_name || ""
        }`.trim(),
        dueDate: updatedFee.due_date?.toISOString() || "NA",
        ReminderSent: updatedFee.reminder_sent,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to send reminder",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
