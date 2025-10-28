// app/api/admin/teacher-salary/route.ts
import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "../../_lib/verify";

const CURRENT_MONTH = 10; // October
const CURRENT_YEAR = 2025;

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    // 2. Query params
    const url = req.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const status = url.searchParams.get("status"); // "added" | "not added"
    const limit = 20;
    const skip = (page - 1) * limit;

    // 3. Validate status
    const validStatuses = ["added", "not added"];
    if (status && !validStatuses.includes(status)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Status must be 'added' or 'not added'",
        status: 400,
      });
    }

    // 4. Fetch teachers
    const teachers = await prisma.teachers.findMany({
      where: { is_active: true },
      skip,
      take: limit,
      select: {
        id: true,
        salary_pay_day: true,
        monthly_salary: true,
        user: {
          select: { first_name: true, last_name: true },
        },
        salary_payments: {
          where: { month: CURRENT_MONTH, year: CURRENT_YEAR },
          select: { payment_status: true, payment_date: true },
        },
      },
      orderBy: { id: "desc" },
    });

    // 5. Count total
    const totalTeachers = await prisma.teachers.count({ where: { is_active: true } });

    // 6. Format
    const teacherSalary = teachers
      .map((t) => {
        const payment = t.salary_payments[0];
        const hasSalary = t.monthly_salary > 0;
        const isAdded = hasSalary;
        const isCurrentMonthPaid = payment?.payment_status === "paid";

        const shouldInclude =
          !status ||
          (status === "added" && isAdded) ||
          (status === "not added" && !isAdded);

        if (!shouldInclude) return null;

        return {
          name: `${t.user.first_name || ""} ${t.user.last_name || ""}`.trim() || "Unknown",
          payDate: t.salary_pay_day?.toString() || "",
          base: hasSalary ? t.monthly_salary.toString() : "0",
          thisMonthStatus: isCurrentMonthPaid ? "paid" : "due",
          thisMonthPaidDate: payment?.payment_date?.toISOString() || "",
        };
      })
      .filter(Boolean);

    const totalPages = Math.ceil(totalTeachers / limit);

    return respondWithSuccess({
      data: {
        teacherSalary,
        pagination: {
          page,
          totalPages,
          total: totalTeachers,
        },
      },
      status: 200,
    });
  } catch (error) {
    console.error("GET /admin/teacher-salary error:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salaries",
      status: 500,
    });
  }
}