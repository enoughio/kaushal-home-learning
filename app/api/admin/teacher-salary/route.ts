import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "../../_lib/verify";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const url = req.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const search = url.searchParams.get("search")?.trim();
    const assignedStatusParam = url.searchParams.get("assigned_status"); // "true" | "false" | null
    const limit = 20;
    const skip = (page - 1) * limit;

    // Parse assigned_status filter  by defult show teachers with assigned salary 
    const assignedStatusFilter =
      assignedStatusParam === "true" ? true :
      assignedStatusParam === "false" ? false :
      true;

      
      // Build WHERE clause
    const where: any = {
      is_active: true,
    };

    if (assignedStatusFilter !== undefined) {
      where.salary_assigned = assignedStatusFilter;
    }
    
    if (search) {
      where.user = {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // 2. Fetch teachers 
    const [teachers, totalTeachers] = await Promise.all([
      prisma.teachers.findMany({
        where,
        skip,
        take: limit,
        
        select: {
          id: true,
          last_salary_payment_date : true,
          monthly_salary: true,
          salary_pay_day: true,
          salary_assigned: true,
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      }
    ),
    
    prisma.teachers.count({ where }),
  ]);
  
  // Format response
  // Current month/year for "this month paid" logic

const teacherSalary = teachers.map((t) => {
  const latestPayment = t.last_salary_payment_date; // Could be null
  const now = new Date();

  // Check if payment exists AND is in the current month/year
  const isPaidThisMonth =
    latestPayment &&
    latestPayment.getFullYear() === now.getFullYear() &&
    latestPayment.getMonth() === now.getMonth();

  return {
    id: t.id.toString(),
    name: `${t.user.first_name || ""} ${t.user.last_name || ""}`.trim() || "Unknown",
    email: t.user.email || "",
    payDate: t.salary_pay_day?.toString() || "",
    base: t.salary_assigned ? t.monthly_salary.toString() : "0",
    thisMonthStatus: isPaidThisMonth ? "paid" : "due",
    thisMonthPaidDate: isPaidThisMonth ? latestPayment.toISOString() : "",
  };
});

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
      details: error instanceof Error ? error.message : undefined,
    });
  }
}