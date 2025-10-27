import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { teacherId: string } }
) {
  try {
    const teacherId = parseInt(params.teacherId);

    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    const teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
      include: {
        user: true,
        salary_payments: {
          orderBy: { created_at: "desc" },
          take: 12, // Last 12 months
        },
      },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    const currentMonth = teacher.salary_payments[0];

    const salaryHistory = teacher.salary_payments.map((payment) => ({
      month: new Date(payment.created_at).toLocaleString("default", {
        month: "short",
      }),
      baseSalary: payment.base_salary,
      bonus: payment.bonus,
      totalSalary: payment.total_amount,
      paidDate: payment.payment_date?.toISOString() || "",
      status: payment.payment_status,
    }));

    return respondWithSuccess({
      data: {
        teacherId: teacher.id.toString(),
        name: `${teacher.user.first_name || ""} ${teacher.user.last_name || ""}`.trim(),
        email: teacher.user.email,
        profileImg: teacher.user.profile_image_url || "https://example.com/photo.jpg",
        phone: teacher.user.phone || "",
        location: teacher.user.location || "",
        subjects: teacher.subjects_taught || [],
        salaryDetails: {
          baseSalary: teacher.monthly_salary,
          bonus: currentMonth?.bonus || 0,
          totalSalary: currentMonth?.total_amount || teacher.monthly_salary,
          MonthPaidDate: currentMonth?.payment_date?.toISOString() || "",
        },
        salaryHistory,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salary details",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
