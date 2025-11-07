// pay fee

import { NextRequest } from "next/server"
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http"
import { prisma } from "@/lib/db"
import { generateTransactionId } from "@/app/api/_lib/helper"
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify"
import { FeeStatus, PaymentMethod, PaymentStatus, PaymentType } from "@/generated/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ feeId: string }> }
) {
  try {
    // === 1. Authentication ===
    const authResult = await authenticateAndValidateAdmin(req)
    if ("error" in authResult) return authResult.error

    // === 2. Parse params and body ===
    const data = await params
    const studentId = parseInt(data.feeId)

    if (isNaN(studentId) || studentId <= 0) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      })
    }

    const body = await req.json()
    const { paymentMethod = PaymentMethod.BANK_TRANSFER, transactionId: transactionIdRaw, date } = body

    const transactionId = transactionIdRaw || generateTransactionId()

    // === 3. Get student info to fetch fee amount ===
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        monthly_fee: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    })

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student not found",
        status: 404,
      })
    }

    const amount = student.monthly_fee || 0

    if (amount <= 0) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid fee amount for this student",
        status: 400,
      })
    }

    // === 4. Find latest fee payment record ===
    const feePayment = await prisma.feePayment.findFirst({
      where: { studentId: studentId },
      orderBy: { created_at: "desc" },
    })

    // === 5. Update or create fee payment ===
    if (!feePayment) {
      // Create new fee payment record
      const newFeePayment = await prisma.feePayment.create({
        data: {
          studentId: studentId,
          total_amount: amount,
          due_date: new Date(date),
          status: FeeStatus.PAID,
          paidAt: new Date(date),
          reminder_sent: 0,
        },
      })

      // Create payment record
      await prisma.payments.create({
        data: {
          status: PaymentStatus.SUCCESS,
          amount: Number(amount),
          payment_type: PaymentType.FEE,
          payment_method: paymentMethod,
          transactionId: transactionId,
          payment_date: new Date(date),
          notes: `Fee payment for ${student.user?.first_name} ${student.user?.last_name}`,
          processedBy: {
            connect: { id: authResult.payload.userId },
          },
          feePayment: {
            connect: { id: newFeePayment.id },
          },
        },
      })

      return respondWithSuccess({
        data: {
          message: "Fee marked as paid successfully",
          studentId: studentId.toString(),
          studentName: `${student.user?.first_name} ${student.user?.last_name}`.trim(),
          amount: Number(amount),
        },
        status: 200,
      })
    }

    // Update existing fee payment record
    await prisma.feePayment.update({
      where: { id: feePayment.id },
      data: {
        status: FeeStatus.PAID,
        paidAt: new Date(date),
        total_amount: amount,
      },
    })

    // Create payment record
    await prisma.payments.create({
      data: {
        status: PaymentStatus.SUCCESS,
        amount: Number(amount),
        payment_type: PaymentType.FEE,
        payment_method: paymentMethod,
        transactionId: transactionId,
        payment_date: new Date(date),
        notes: `Fee payment for ${student.user?.first_name} ${student.user?.last_name}`,
        processedBy: {
          connect: { id: authResult.payload.userId },
        },
        feePayment: {
          connect: { id: feePayment.id },
        },
      },
    })

    return respondWithSuccess({
      data: {
        message: "Fee marked as paid successfully",
        studentId: studentId.toString(),
        studentName: `${student.user?.first_name} ${student.user?.last_name}`.trim(),
        amount: Number(amount),
      },
      status: 200,
    })
  } catch (error) {
    console.error("Error marking fee as paid:", error)
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to mark fee as paid",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    })
  }
}