import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

type AddFeePayload = {
  studentId: number;
  month: number;
  year: number;
  amount: number;
  dueDate?: string;
};

export async function POST(req: NextRequest) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  let payload: AddFeePayload;
  try {
    payload = await req.json();
  } catch (error) {
    return respondWithError({
      error: "INVALID_JSON",
      message: "Request body must be valid JSON",
      status: 400,
    });
  }

  const { studentId, month, year, amount, dueDate } = payload;

  if (!studentId || !Number.isInteger(studentId) || studentId <= 0) {
    return respondWithError({
      error: "INVALID_STUDENT_ID",
      message: "Valid student id is required",
      status: 400,
    });
  }

  if (!month || !year || month < 1 || month > 12 || year < 2020) {
    return respondWithError({
      error: "INVALID_MONTH_YEAR",
      message: "Valid month (1-12) and year (>= 2020) are required",
      status: 400,
    });
  }

  if (!amount || amount <= 0) {
    return respondWithError({
      error: "INVALID_AMOUNT",
      message: "Fee amount must be greater than 0",
      status: 400,
    });
  }

  try {
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) {
      return respondWithError({
        error: "STUDENT_NOT_FOUND",
        message: "The requested student does not exist",
        status: 404,
      });
    }

    // Check if fee already exists for this month/year
    const existingFee = await prisma.student_fees.findUnique({
      where: {
        student_id_month_year: {
          student_id: studentId,
          month,
          year,
        },
      },
    });

    if (existingFee) {
      return respondWithError({
        error: "FEE_ALREADY_EXISTS",
        message: "Fee record already exists for this month and year",
        status: 409,
      });
    }

    const calculatedDueDate = dueDate
      ? new Date(dueDate)
      : new Date(year, month - 1, student.fee_due_date?.getDate() || 1);

    const newFee = await prisma.student_fees.create({
      data: {
        student_id: studentId,
        month,
        year,
        amount,
        due_date: calculatedDueDate,
      },
    });

    return respondWithSuccess({
      data: {
        feeId: newFee.id,
        studentId,
        month,
        year,
        amount,
        dueDate: newFee.due_date,
      },
      message: "Student fee record added successfully",
    });
  } catch (error) {
    console.error("POST /admin/student-fee/add error", error);
    return respondWithError({
      error: "FEE_ADD_FAILED",
      message: "Unable to add student fee record",
      status: 500,
    });
  }
}