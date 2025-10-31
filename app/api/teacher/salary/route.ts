import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
      include: { user: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      });
    }

    const [salaries, totalRecords] = await Promise.all([
      prisma.salary_payments.findMany({
        where: { teacher_id: teacher.id },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.salary_payments.count({ where: { teacher_id: teacher.id } }),
    ]);

    const salaryHistory = salaries.map((salary) => ({
      month: new Date(salary.created_at).toLocaleString("default", {
        month: "short",
      }),
      baseSalary: salary.base_salary,
      bonus: salary.bonus,
      totalSalary: salary.total_amount,
      paidDate: salary.payment_date?.toISOString() || "",
      status: salary.payment_status,
    }));

    const totalPages = Math.ceil(totalRecords / limit);

    return respondWithSuccess({
      data: {
        teacherId: teacher.id.toString(),
        name: `${teacher.user.first_name || ""} ${teacher.user.last_name || ""}`.trim(),
        salaryHistory,
        page,
        totalPages,
        totalRecords,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch salary history",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
