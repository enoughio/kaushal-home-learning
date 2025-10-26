import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    return getPaymentStats();
  }

  // Default: list payments
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const where: any = {};
  if (type && ["student_fee", "teacher_salary"].includes(type)) {
    where.payment_type = type;
  }
  if (status && ["pending", "completed", "failed"].includes(status)) {
    where.payment_status = status;
  }

  try {
    const [total, payments] = await Promise.all([
      prisma.payments.count({ where }),
      prisma.payments.findMany({
        where,
        include: {
          student: {
            include: {
              user: true,
            },
          },
          processed_by_user: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const paymentList = payments.map((payment) => ({
      id: payment.id,
      studentId: payment.student_id,
      studentName: `${payment.student.user.first_name} ${payment.student.user.last_name}`.trim(),
      email: payment.student.user.email,
      amount: payment.amount,
      paymentType: payment.payment_type,
      paymentStatus: payment.payment_status,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      paymentDate: payment.payment_date,
      dueDate: payment.due_date,
      lateFee: payment.late_fee,
      discount: payment.discount,
      notes: payment.notes,
      processedBy: payment.processed_by_user ? `${payment.processed_by_user.first_name} ${payment.processed_by_user.last_name}` : null,
      createdAt: payment.created_at,
    }));

    return respondWithSuccess({
      data: {
        payments: paymentList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /admin/payments error", error);
    return respondWithError({
      error: "PAYMENTS_FETCH_FAILED",
      message: "Unable to fetch payments",
      status: 500,
    });
  }
}

async function getPaymentStats() {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [totalPayments, completedThisMonth, pendingThisMonth, totalAmount] = await Promise.all([
      prisma.payments.count(),
      prisma.payments.count({
        where: {
          payment_status: "completed",
          payment_date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      }),
      prisma.payments.count({
        where: {
          payment_status: "pending",
          due_date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      }),
      prisma.payments.aggregate({
        where: { payment_status: "completed" },
        _sum: { amount: true },
      }),
    ]);

    return respondWithSuccess({
      data: {
        totalPayments,
        completedThisMonth,
        pendingThisMonth,
        totalAmount: totalAmount._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error("GET /admin/payments/stats error", error);
    return respondWithError({
      error: "PAYMENT_STATS_FAILED",
      message: "Unable to fetch payment statistics",
      status: 500,
    });
  }
}