// app/api/admin/salary-stats/route.ts
import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

/**
 * Returns:
 *   totalSalaries   – sum of all assigned monthly salaries
 *   dueSalaries     – sum of salaries that have **no payment** for the current month
 *   activeTeachers  – count of teachers with is_active = true
 */
export async function GET(req: NextRequest) {
  try {
    // ---- 1. Admin authentication ------------------------------------------------
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    // ---- 2. Current month / year ------------------------------------------------
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    // ---- 3. Parallel queries ----------------------------------------------------
    const [
      totalSalariesAgg,
      dueSalaries,
      activeTeachers,
    ] = await Promise.all([
      // 3a – total of all assigned salaries
      prisma.teachers.aggregate({
        where: { salary_assigned: true },
        _sum: { monthly_salary: true },
      }),

      // 3b – **due** salaries (no payment in current month)
      //      We fetch teachers that have salary_assigned = true
      //      and join the latest salary_payment (if any) for the current month.
      prisma.teachers
        .findMany({
          where: { salary_assigned: true },
          select: {
            id: true,
            monthly_salary: true,
            salary_payments: {
              where: {
                payment: {
                  payment_date: {
                    gte: new Date(currentYear, currentMonth, 1),          // first day of month
                    lt:  new Date(currentYear, currentMonth + 1, 1),      // first day of next month
                  },
                },
              },
              select: { id: true }, // we only need to know if a row exists
              take: 1,
            },
          },
        })
        .then((teachers) => {
          // Teachers **without** a payment this month
          const dueTeachers = teachers.filter((t) => t.salary_payments.length === 0);
          return dueTeachers.reduce(
            (sum, t) => sum + (t.monthly_salary ?? 0),
            0
          );
        }),

      // 3c – active teachers count
      prisma.teachers.count({
        where: { is_active: true },
      }),
    ]);

    // ---- 4. Response -----------------------------------------------------------
    return respondWithSuccess({
      data: {
        totalSalaries: totalSalariesAgg._sum.monthly_salary ?? 0,
        dueSalaries,
        activeTeachers,
      },
      status: 200,
    });
  } catch (error) {
    console.error("[Salary Stats] error:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salary statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}