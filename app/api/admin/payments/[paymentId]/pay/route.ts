import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { generateTransactionId } from "@/app/api/_lib/helper";

interface AddPaymentRequestBody {
  amount: number;
  transactionId?: string;
  paymentDate: string;
  paymentType: "FEE" | "SALARY";
  paymentMethod: "CASH" | "BANK_TRANSFER" | "ONLINE_PAYMENT";
  processedBy: number;
  notes?: string;
}



export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  // here payment id is treated as entityId
  try {
    const { paymentId: rawEntityId } = await params;
    const entityId = parseInt(rawEntityId, 10);

    if (isNaN(entityId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid entity ID",
        status: 400,
      });
    }

    const body = await req.json();
    const {
      amount,
      transactionId: clientTransactionId,
      paymentDate: paymentDateStr,
      paymentType,
      paymentMethod,
      processedBy,
      notes,
    }: AddPaymentRequestBody = body;

    // Validate required fields
    if (!amount || !paymentDateStr || !paymentType || !paymentMethod || !processedBy) {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Missing required fields: amount, paymentDate, paymentType, paymentMethod, processedBy",
        status: 400,
      });
    }

    // Validate amount
    if (amount <= 0) {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Amount must be greater than 0",
        status: 400,
      });
    }

    // Parse and validate payment date
    const paymentDate = new Date(paymentDateStr);
    if (isNaN(paymentDate.getTime())) {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Invalid payment date",
        status: 400,
      });
    }

    // Generate or use provided transaction ID
    const transactionId = clientTransactionId || generateTransactionId();

    // Check if transaction ID already exists
    const existingPayment = await prisma.payments.findUnique({
      where: { transactionId },
    });

    if (existingPayment) {
      return respondWithError({
        error: "CONFLICT",
        message: "Transaction ID already exists. Provide a different one or omit to auto-generate.",
        status: 409,
      });
    }

    // Validate entity exists based on payment type
    if (paymentType === "SALARY") {
      const teacher = await prisma.teachers.findUnique({
        where: { id: entityId },
      });

      if (!teacher) {
        return respondWithError({
          error: "NOT_FOUND",
          message: "Teacher not found",
          status: 404,
        });
      }

      if (!teacher.salary_assigned) {
        return respondWithError({
          error: "INVALID_REQUEST",
          message: "Teacher salary is not assigned yet",
          status: 400,
        });
      }
    } else if (paymentType === "FEE") {
      const student = await prisma.students.findUnique({
        where: { id: entityId },
      });

      if (!student) {
        return respondWithError({
          error: "NOT_FOUND",
          message: "Student not found",
          status: 404,
        });
      }
    } else {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Invalid payment type. Must be SALARY or FEE",
        status: 400,
      });
    }

    // Process payment in transaction
    const result = await prisma.$transaction(async (tx) => {
      let salaryPaymentId: number | null = null;
      let feePaymentId: number | null = null;

      // Create related payment record (SalaryPayment or FeePayment)
      if (paymentType === "SALARY") {
        const salaryPayment = await tx.salaryPayment.create({
          data: {
            date: paymentDate,
            total_amount: amount,
            teacherId: entityId,
            status: "PAID",
          },
        });
        salaryPaymentId = salaryPayment.id;

        // Update teacher last salary payment date
        await tx.teachers.update({
          where: { id: entityId },
          data: { last_salary_payment_date: paymentDate },
        });
      } else {
        const feePayment = await tx.feePayment.create({
          data: {
            date: paymentDate,
            total_amount : amount,
            studentId: entityId,
            status: "PAID",
          },
        });
        feePaymentId = feePayment.id;

        // Update student last fee payment date
        await tx.students.update({
          where: { id: entityId },
          data: { last_fee_payment_date: paymentDate },
        });
      }

      // Create payment record
      const payment = await tx.payments.create({
        data: {
          amount,
          transactionId,
          payment_date: paymentDate,
          payment_type: paymentType,
          payment_method: paymentMethod,
          notes: notes || null,
          processedById: processedBy,
          salaryPaymentId,
          feePaymentId,
        },
      });

      return { payment, salaryPaymentId, feePaymentId };
    });

    return respondWithSuccess({
      data: {
        paymentId: result.payment.id,
        transactionId: result.payment.transactionId,
        amount: result.payment.amount,
        paymentType: result.payment.payment_type,
        paymentMethod: result.payment.payment_method,
        paymentDate: result.payment.payment_date,
        status: "SUCCESS",
        notes: result.payment.notes,
      },
      message: `${paymentType} payment recorded successfully`,
      status: 201,
    });
  } catch (error) {
    console.error("Payment recording error:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to record payment",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}