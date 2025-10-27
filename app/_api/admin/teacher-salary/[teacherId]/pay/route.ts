import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { teacherId: string } }
) {
  try {
    const teacherId = parseInt(params.teacherId);

    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    const body = await req.json();
    const { month, year, paymentMethod, transactionId, date } = body;

    const teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    // Create salary payment entry
    const salaryPayment = await prisma.salary_payments.create({
      data: {
        teacher_id: teacherId,
        month: parseInt(month),
        year: parseInt(year),
        base_salary: teacher.monthly_salary,
        bonus: 0,
        total_amount: teacher.monthly_salary,
        payment_status: "completed",
        payment_date: new Date(date),
        payment_method: paymentMethod,
        transaction_id: transactionId,
      },
    });

    return respondWithSuccess({
      data: {
        message: "Salary marked as paid successfully",
        teacherId: teacher.id.toString(),
        month,
        year,
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
      message: "Failed to mark salary as paid",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
