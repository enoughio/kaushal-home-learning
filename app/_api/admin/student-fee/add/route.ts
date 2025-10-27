import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, fee, dueDate } = body;

    if (!studentId || !fee) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "studentId and fee are required",
        status: 400,
      });
    }

    const student = await prisma.students.findUnique({
      where: { id: parseInt(studentId) },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      });
    }

    const dueDateObj = new Date(dueDate);
    const month = dueDateObj.getMonth() + 1;
    const year = dueDateObj.getFullYear();

    // Create student fee record
    const studentFee = await prisma.student_fees.create({
      data: {
        student_id: parseInt(studentId),
        amount: fee,
        due_date: dueDateObj,
        month,
        year,
        status: "due",
      },
    });

    return respondWithSuccess({
      data: {
        message: "Fee record added successfully",
        studentId: student.id.toString(),
        feeDetails: {
          fee,
          status: "due",
          dueDate,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to add fee record",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
