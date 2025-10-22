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
    return getSalaryStats();
  }

  // Default: list teacher salaries
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });
  const status = searchParams.get("status");

  const where: any = {};
  if (status && ["paid", "pending"].includes(status)) {
    where.payment_status = status === "paid" ? "completed" : "pending";
  }

  try {
    const [total, salaries] = await Promise.all([
      prisma.salary_payments.count({ where }),
      prisma.salary_payments.findMany({
        where,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const salaryList = salaries.map((salary) => ({
      id: salary.id,
      teacherId: salary.teacher_id,
      teacherName: `${salary.teacher.user.first_name} ${salary.teacher.user.last_name}`.trim(),
      email: salary.teacher.user.email,
      month: salary.month,
      year: salary.year,
      baseSalary: salary.base_salary,
      bonus: salary.bonus,
      deductions: salary.deductions,
      totalAmount: salary.total_amount,
      paymentStatus: salary.payment_status,
      paymentDate: salary.payment_date,
      paymentMethod: salary.payment_method,
      transactionId: salary.transaction_id,
      createdAt: salary.created_at,
    }));

    return respondWithSuccess({
      data: {
        teacherSalaries: salaryList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /admin/teacher-salary error", error);
    return respondWithError({
      error: "SALARY_FETCH_FAILED",
      message: "Unable to fetch teacher salaries",
      status: 500,
    });
  }
}

async function getSalaryStats() {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [totalTeachers, paidThisMonth, pendingThisMonth, totalPaidAmount] = await Promise.all([
      prisma.teachers.count({ where: { is_active: true } }),
      prisma.salary_payments.count({
        where: {
          month: currentMonth,
          year: currentYear,
          payment_status: "completed",
        },
      }),
      prisma.salary_payments.count({
        where: {
          month: currentMonth,
          year: currentYear,
          payment_status: "pending",
        },
      }),
      prisma.salary_payments.aggregate({
        where: { payment_status: "completed" },
        _sum: { total_amount: true },
      }),
    ]);

    return respondWithSuccess({
      data: {
        totalTeachers,
        paidThisMonth,
        pendingThisMonth,
        totalPaidAmount: totalPaidAmount._sum.total_amount || 0,
      },
    });
  } catch (error) {
    console.error("GET /admin/teacher-salary/stats error", error);
    return respondWithError({
      error: "SALARY_STATS_FAILED",
      message: "Unable to fetch salary statistics",
      status: 500,
    });
  }
}