import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};
    if (status) whereClause.payment_status = status;

    const [salaries, totalSalaries] = await Promise.all([
      prisma.salary_payments.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.salary_payments.count({ where: whereClause }),
    ]);

    const formattedSalaries = salaries.map((salary) => ({
      name: `${salary.teacher.user.first_name || ""} ${salary.teacher.user.last_name || ""}`.trim(),
      Date: salary.created_at.toISOString(),
      Base: salary.base_salary.toFixed(2),
      Bonus: salary.bonus.toFixed(2),
      thisMonthStatus: salary.payment_status,
      thisMonthPaidDate: salary.payment_date?.toISOString() || "",
    }));

    const totalPages = Math.ceil(totalSalaries / limit);

    return respondWithSuccess({
      data: {
        teacherSalary: formattedSalaries,
        page,
        totalPages,
        totalSalaries,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salaries",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
