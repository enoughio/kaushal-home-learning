import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";
import { SalaryStatus } from "@/generated/prisma";

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
    const statusParam = searchParams.get("status");
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

    // build where clause with optional status filter
    const whereClause: { teacherId: number; status?: SalaryStatus } = { teacherId: teacher.id };
    if (statusParam && statusParam !== "all") {
      // map friendly status to Prisma enum values
      const s = statusParam.toLowerCase();
      if (s === "paid") whereClause.status = SalaryStatus.PAID;
      else if (s === "unpaid" || s === "pending") whereClause.status = SalaryStatus.UNPAID;
    }

    const [salaries, totalRecords] = await Promise.all([
      prisma.salaryPayment.findMany({
        where: whereClause,
        select: {
          created_at: true,
          total_amount: true,
          date: true,
          status: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),

      prisma.salaryPayment.count({ where: whereClause }),
    ]);

    const salaryHistory = salaries.map((salary) => ({
      month: new Date(salary.created_at).toLocaleString("default", {
        month: "short",
      }),
      totalSalary: salary.total_amount,
      paidDate: salary.date?.toISOString() || "",
      status: salary.status,
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
