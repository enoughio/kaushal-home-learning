
import { NextRequest, NextResponse } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";
import { TeacherSalaryResponse } from "@/lib/types";

// get teacher salary information with pagination and filtering
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {

    const url = req.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const search = url.searchParams.get("search")?.trim();
    const assignedStatusParam = url.searchParams.get("assigned_status");
    const limit = 20;
    const skip = (page - 1) * limit;

    const assignedStatusFilter =
      assignedStatusParam === "true"
        ? true
        : assignedStatusParam === "false"
        ? false
        : true;

    const where : Prisma.teachersWhereInput = {
      is_active: true,
      salary_assigned: assignedStatusFilter,
    };

    if (search) {
      where.user = {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [teachers, totalTeachers] = await Promise.all([
      prisma.teachers.findMany({
        where,
        skip,
        take: limit,

        select: {
          id: true,
          last_salary_payment_date: true,
          monthly_salary: true,
          salary_pay_day: true,
          salary_assigned: true,
          // salary_payments : { // get latest salary payment
          //   orderBy: { created_at: "desc" }, take: 1,
          //   select : {
          //     created_at : true,
          //   }
          // },
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      }),
      prisma.teachers.count({ where }),

    ]);

    const teacherSalary: TeacherSalaryResponse[] = teachers.map((t) => {
      const latestPayment = t.last_salary_payment_date;
      const now = new Date();

      const isPaidThisMonth =
        latestPayment &&
        latestPayment.getFullYear() === now.getFullYear() &&
        latestPayment.getMonth() === now.getMonth();


      return {
        teacherId: t.id.toString(),
        name:
          `${t.user.first_name || ""} ${t.user.last_name || ""}`.trim() ||
          "Unknown",
        email: t.user.email || "",
        payDate: t.salary_pay_day?.toString() || "",
        // `base` should be a number as defined in `TeacherSalaryResponse`
        base: t.salary_assigned ? Number(t.monthly_salary) : 0,
        thisMonthStatus: isPaidThisMonth ? "paid" : "due",  
        lastPayDate : latestPayment,
        thisMonthPaidDate: isPaidThisMonth ? latestPayment.toISOString() : "",
      };
    });

    const totalPages = Math.ceil(totalTeachers / limit);

    return respondWithSuccess({
      data: {
        teacherSalary,
        pagination: { page, totalPages, total: totalTeachers },
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
