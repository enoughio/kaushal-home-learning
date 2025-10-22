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
    return getFeeStats();
  }

  // Default: list student fees
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });

  try {
    const [total, fees] = await Promise.all([
      prisma.student_fees.count(),
      prisma.student_fees.findMany({
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { due_date: "asc" },
        skip,
        take: limit,
      }),
    ]);

    const feeList = fees.map((fee) => ({
      id: fee.id,
      studentId: fee.student_id,
      studentName: `${fee.student.user.first_name} ${fee.student.user.last_name}`.trim(),
      email: fee.student.user.email,
      month: fee.month,
      year: fee.year,
      amount: fee.amount,
      dueDate: fee.due_date,
      status: fee.status,
      reminderSent: fee.reminder_sent,
      createdAt: fee.created_at,
    }));

    return respondWithSuccess({
      data: {
        studentFees: feeList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /admin/student-fee error", error);
    return respondWithError({
      error: "FEE_FETCH_FAILED",
      message: "Unable to fetch student fees",
      status: 500,
    });
  }
}

async function getFeeStats() {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [totalStudents, paidThisMonth, pendingThisMonth, overdueFees, totalCollected] = await Promise.all([
      prisma.students.count({ where: { is_active: true } }),
      prisma.student_fees.count({
        where: {
          month: currentMonth,
          year: currentYear,
          status: "paid",
        },
      }),
      prisma.student_fees.count({
        where: {
          month: currentMonth,
          year: currentYear,
          status: "due",
        },
      }),
      prisma.student_fees.count({
        where: {
          due_date: { lt: currentDate },
          status: "due",
        },
      }),
      prisma.student_fees.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
    ]);

    return respondWithSuccess({
      data: {
        totalStudents,
        paidThisMonth,
        pendingThisMonth,
        overdueFees,
        totalCollected: totalCollected._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error("GET /admin/student-fee/stats error", error);
    return respondWithError({
      error: "FEE_STATS_FAILED",
      message: "Unable to fetch fee statistics",
      status: 500,
    });
  }
}