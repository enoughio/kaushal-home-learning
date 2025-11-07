import { NextRequest } from "next/server"
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http"
import { prisma } from "@/lib/db"
import { sendFeeReminderEmail } from "@/helper/mail/emailHelpers"
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ feeId: string }> }
) {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()

  try {
    // === 1. Admin Authentication ===
    const authResult = await authenticateAndValidateAdmin(req)
    if ("error" in authResult) {
      console.warn(`[REMIND] Unauthorized access`, { requestId })
      return authResult.error
    }
    const adminId = authResult.payload.userId

    // === 2. Parse feeId (studentId) from params ===
    const { feeId: studentIdStr } = await params
    const studentId = parseInt(studentIdStr, 10)
    if (isNaN(studentId) || studentId <= 0) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid student ID",
        status: 400,
      })
    }

    // === 3. Get student info ===
    const student = await prisma.students.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: { first_name: true, last_name: true, email: true },
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

    // === 4. Find fee payment record ===
    const feePayment = await prisma.feePayment.findFirst({
      where: { studentId: studentId },
      orderBy: { created_at: "desc" },
    })

    // === 5. Increment reminder count and send email ===
    const updatedFee = await prisma.feePayment.upsert({
      where: { id: feePayment?.id || 0 },
      update: {
        reminder_sent: { increment: 1 },
      },
      create: {
        studentId: studentId,
        total_amount: student.monthly_fee,
        due_date: student.fee_due_date || new Date(),
        status: "DUE",
        reminder_sent: 1,
      },
    })

    // === 6. Send email reminder ===
    await sendFeeReminderEmail(student.user?.email || "", {
      amount: student.monthly_fee,
      dueDate: student.fee_due_date || new Date(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      reminderCount: updatedFee.reminder_sent,
      studentName: `${student.user?.first_name || ""} ${student.user?.last_name || ""}`.trim(),
    }).catch((err) => {
      console.error(`[REMIND] Email failed for student ${studentId}`, err)
    })

    // === 7. Build success response ===
    console.log(`[REMIND] Success`, {
      requestId,
      adminId,
      studentId,
      reminderCount: updatedFee.reminder_sent,
      durationMs: Date.now() - startTime,
    })

    return respondWithSuccess({
      data: {
        message: "Fee reminder sent successfully",
        studentId: studentId.toString(),
        studentName: `${student.user?.first_name || ""} ${student.user?.last_name || ""}`.trim(),
        reminderSent: updatedFee.reminder_sent,
      },
      status: 200,
    })
  } catch (error) {
    console.error(`[REMIND] Error`, {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to send reminder",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    })
  }
} 