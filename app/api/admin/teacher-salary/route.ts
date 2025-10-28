import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "../../_lib/verify";

// Define JWT payload type (consistent with other routes)
interface JwtPayload {
  userId: number;
  role: string;
}

// Define interface for salary payment with teacher and user
interface SalaryWithTeacher {
  id: number;
  teacher_id: number;
  month: number;
  year: number;
  base_salary: number;
  bonus: number;
  deductions: number;
  total_amount: number;
  payment_status: string;
  payment_date: Date | null;
  created_at: Date;
  teacher: {
    user: {
      first_name: string | null;
      last_name: string | null;
    };
  };
}

// Define response type
interface SalaryResponse {
  message: string;
  salaries: {
    id: number;
    teacherId: number;
    teacherName: string;
    month: number;
    year: number;
    baseSalary: string;
    bonus: string;
    deductions: string;
    totalAmount: string;
    paymentStatus: string;
    paymentDate: string | null;
    createdAt: string;
  }[];
  page: number;
  totalPages: number;
  totalSalaries: number;
}


export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const status = searchParams.get("status");

    // Validate page
    if (isNaN(page) || page < 1) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid page number",
        status: 400,
      });
    }

    // Validate status
    const validStatuses = ["pending", "paid"];
    if (status && !validStatuses.includes(status)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid payment status",
        status: 400,
      });
    }

    const skip = (page - 1) * limit;
    const whereClause = status ? { payment_status: status } : {};

    const [salaries, totalSalaries] = await Promise.all([
      prisma.salary_payments.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          teacher: {
            include: {
              user: {
                select: { first_name: true, last_name: true },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      }) as Promise<SalaryWithTeacher[]>,
      prisma.salary_payments.count({ where: whereClause }),
    ]);

    const formattedSalaries = salaries.map((salary) => ({
      id: salary.id,
      teacherId: salary.teacher_id,
      teacherName: `${salary.teacher.user.first_name || ""} ${salary.teacher.user.last_name || ""}`.trim() || "Unknown",
      month: salary.month,
      year: salary.year,
      baseSalary: salary.base_salary.toFixed(2),
      bonus: salary.bonus.toFixed(2),
      deductions: salary.deductions.toFixed(2),
      totalAmount: salary.total_amount.toFixed(2),
      paymentStatus: salary.payment_status,
      paymentDate: salary.payment_date?.toISOString() || null,
      createdAt: salary.created_at.toISOString(),
    }));

    const totalPages = Math.ceil(totalSalaries / limit);

    return respondWithSuccess({
      data: {
        message: "Teacher salaries fetched successfully",
        salaries: formattedSalaries,
        page,
        totalPages,
        totalSalaries,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching teacher salaries:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salaries",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}