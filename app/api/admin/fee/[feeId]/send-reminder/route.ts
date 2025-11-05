// // app/api/admin/student-fee/[feeId]/remind/route.ts
// import { NextRequest } from "next/server";
// import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
// import { prisma } from "@/lib/db";
// import { FeeStatus } from "@/generated/prisma";
// import { sendFeeReminderEmail } from "@/helper/mail/emailHelpers";
// import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

import { NextResponse } from "next/server"

// // === In-memory rate limiting (per admin user) ===
// const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// // === Helper: Simple rate limit (10 req/min per admin) ===
// function checkRateLimit(userId: number): { allowed: boolean; resetIn: number } {
//   const key = `remind:${userId}`;
//   const now = Date.now();
//   const windowMs = 60 * 60 * 1000; // 1 hour
//   const maxRequests = 3;

//   const record = rateLimitMap.get(key);

//   if (!record || now > record.resetAt) {
//     rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
//     return { allowed: true, resetIn: windowMs };
//   }

//   if (record.count >= maxRequests) {
//     return { allowed: false, resetIn: record.resetAt - now };
//   }

//   record.count++;
//   return { allowed: true, resetIn: record.resetAt - now };
// }

// // === Helper: Generate idempotency key if missing ===
// function getIdempotencyKey(req: NextRequest): string {
//   return req.headers.get("idempotency-key") || `remind-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// }

// // === In-memory idempotency store (cleared on server restart) ===
// const idempotencyStore = new Map<string, { response: unknown; expiresAt: number }>();

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ feeId: string }> }
// ) {
//   const requestId = crypto.randomUUID();
//   const startTime = Date.now();

//   try {
//     // === 1. Admin Authentication ===
//     const authResult = await authenticateAndValidateAdmin(req);
//     if ("error" in authResult) {
//       console.warn(`[REMIND] Unauthorized access`, { requestId });
//       return authResult.error;
//     }
//     const adminId = authResult.payload.userId;

//     // === 2. Rate Limiting ===
//     const rateLimit = checkRateLimit(adminId);
//     if (!rateLimit.allowed) {
//       return respondWithError({
//         error: "TOO_MANY_REQUESTS",
//         message: `Too many requests. Try again in ${Math.ceil(rateLimit.resetIn / 1000)}s.`,
//         status: 429,
//       });
//     }

//     // === 3. Parse feeId from params ===
//     const { feeId: feeIdStr } = await params;
//     const feeId = parseInt(feeIdStr, 10);
//     if (isNaN(feeId) || feeId <= 0) {
//       return respondWithError({
//         error: "INVALID_REQUEST",
//         message: "Invalid fee ID",
//         status: 400,
//       });
//     }

//     // === 4. Parse and validate JSON body ===
//     let body: { studentId?: number; idempotencyKey?: string };
//     try {
//       body = await req.json();
//     } catch {
//       return respondWithError({
//         error: "INVALID_REQUEST",
//         message: "Invalid JSON",
//         status: 400,
//       });
//     }

//     const studentId = body.studentId ? parseInt(String(body.studentId), 10) : NaN;
//     if (isNaN(studentId) || studentId <= 0) {
//       return respondWithError({
//         error: "INVALID_REQUEST",
//         message: "studentId must be a positive integer",
//         status: 400,
//       });
//     }

//     // === 5. Idempotency ===
//     const idempotencyKey = getIdempotencyKey(req);
//     const existing = idempotencyStore.get(idempotencyKey);
//     if (existing && Date.now() < existing.expiresAt) {
//       console.info(`[REMIND] Idempotent response reused`, { requestId, idempotencyKey });
//       return existing.response;
//     }

//     // === 6. Current month range ===
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

//     // === 7. Find existing fee ===
//     const fee = await prisma.feePayment.findFirst({
//       where: {
//         created_at: { gte: startOfMonth, lt: startOfNextMonth },
//         OR: [{ id: feeId }, { studentId }],
//       },
//       include: {
//         student: {
//           select: {
//             id: true,
//             monthly_fee: true,
//             fee_due_date: true,
//             last_fee_payment_date: true,
//             user: {
//               select: { first_name: true, last_name: true, email: true },
//             },
//           },
//         },
//       },
//     });

//     let updatedFee: { id: number; reminder_sent: number; due_date?: Date };
//     let student: {
//       id: number;
//       monthly_fee: number;
//       fee_due_date: Date;
//       user?: { first_name: string; last_name: string; email: string };
//     };

//     // === 8. Transaction: Create or Update Fee + Send Email ===
//     const result = await prisma.$transaction(async (tx) => {
//       if (!fee) {
//         // Create new fee record
//         student = await tx.students.findUnique({
//           where: { id: studentId },
//           select: {
//             id: true,
//             monthly_fee: true,
//             fee_due_date: true,
//             last_fee_payment_date: true,
//             user: { select: { first_name: true, last_name: true, email: true } },
//           },
//         });

//         if (!student) throw new Error("Student not found");

//         // Ensure `fee_due_date` and `last_fee_payment_date` are handled properly
//         const feeDueDate = student.fee_due_date ?? new Date();
//         const lastFeePaymentDate = student.last_fee_payment_date ?? new Date();

//         updatedFee = await tx.feePayment.create({
//           data: {
//             total_amount: student.monthly_fee,
//             due_date: feeDueDate,
//             status: FeeStatus.DUE,
//             reminder_sent: 1,
//             student: { connect: { id: student.id } },
//           },
//         });
//       } else {
//         student = fee.student;
//         // Updated type handling for `updatedFee` and `student`
//         updatedFee = await tx.feePayment.update({
//           where: { id: fee.id },
//           data: { reminder_sent: { increment: 1 } },
//         });
//       }

//       // === Fire-and-forget email (non-blocking) ===
//       // Updated email payload to handle optional fields
//       await sendFeeReminderEmail(
//         student.user?.email || "",
//         {
//           amount: student.monthly_fee,
//           dueDate: feeDueDate,
//           month: now.getMonth() + 1,
//           year: now.getFullYear(),
//           reminderCount: updatedFee.reminder_sent,
//           studentName: `${student.user?.first_name || ""} ${student.user?.last_name || ""}`.trim(),
//         }
//       ).catch((err) => {
//         console.error(`[REMIND] Email failed for student ${student.id}`, err);
//       });

//       return { updatedFee, student };
//     });

//     // === 9. Build success response ===
//     const response = respondWithSuccess({
//       data: {
//         message: "Payment reminder sent successfully",
//         feeId: result.updatedFee.id.toString(),
//         studentId: result.updatedFee.studentId.toString(),
//         studentName: `${result.student.user?.first_name || ""} ${result.student.user?.last_name || ""}`.trim(),
//         dueDate: result.updatedFee.due_date
//           ? `${result.updatedFee.due_date.getDate()} ${new Date().toLocaleDateString("default", { month: "short" })}`
//           : "NA",
//         reminderSent: result.updatedFee.reminder_sent,
//       },
//       status: 200,
//     });

//     // === 10. Save idempotent response (24h) ===
//     idempotencyStore.set(idempotencyKey, {
//       response,
//       expiresAt: Date.now() + 24 * 60 * 60 * 1000,
//     });

//     // === 11. Logging ===
//     console.log(`[REMIND] Success`, {
//       requestId,
//       adminId,
//       feeId,
//       studentId: result.student.id,
//       reminderCount: result.updatedFee.reminder_sent,
//       durationMs: Date.now() - startTime,
//     });

//     return response;
//   } catch (error) {
//     console.error(`[REMIND] Error`, {
//       requestId,
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//     });

//     return respondWithError({
//       error: "INTERNAL_SERVER_ERROR",
//       message: "Failed to send reminder",
//       status: 500,
//       details: error instanceof Error ? error.message : undefined,
//     });
//   }
// }



export const GET = () => { 

  return NextResponse.json({ status: "OK" });
} 