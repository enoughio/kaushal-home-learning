import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

export async function GET(req: NextRequest) {
  // get all the students who do not have a fee assigned yet
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const students = await prisma.students.findMany({
      where: {
        last_fee_payment_date: null,
        monthly_fee: 0,
      },

      select: {
        id: true,
        parent_name: true,
        enrollment_date: true,
        grade: true,
        parent_phone: true,
        parent_email: true,
        preferred_schedule: true,
        fee_due_date: true,
        monthly_fee: true,

        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            location: true,
          },
        },
      },
    });

    return respondWithSuccess({
      data: {
        students: students,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch students without fee",
      status: 500,
    });
  }
}



// assign a monthly fee to a student
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, feeAmount, dueDate } = body;

    if (!studentId || !feeAmount) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "studentId and feeAmount are required",
        status: 400,
      });
    }

        if (feeAmount < 100 ) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "feeAmount should be at least 100",
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

    // Update student fee record
    const studentFee = await prisma.students.update({
      where: { id: student.id },
      data: {
        
        monthly_fee: feeAmount,
        fee_due_date: dueDateObj,
        grace_period_end : new Date(year, month - 1, 7), 
      },
    });

    return respondWithSuccess({
      data: {
        message: "Fee Details added successfully",
        studentId: student.id.toString(),
        feeDetails: {
          fee : studentFee.monthly_fee,
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
