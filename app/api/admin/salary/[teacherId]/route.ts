// app/api/admin/teacher-salary/[teacherId]/route.ts
import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise <{ teacherId: string }> }
) {
  try {

    const data = await params
    const teacherId = parseInt(data.teacherId);

    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;


    // Validate teacherId
    if (isNaN(teacherId) || teacherId < 1) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    // Fetch Teacher with Salary Payments
    const teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },

      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            location: true,
            profile_image_url: true,
          },
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

    // if current month salary entry exist then check if it is paid or not, if not exist then mark it as unpaid
    const now = new Date();

    const latestPayment = teacher.last_salary_payment_date;

    const isCurrentMonthPaid =
      latestPayment &&
      latestPayment.getMonth() == now.getMonth() &&
      latestPayment.getFullYear() == now.getFullYear();

    return respondWithSuccess({
      data: {
        teacherId: teacher.id.toString(),
        name:
          `${teacher.user.first_name || ""} ${
            teacher.user.last_name || ""
          }`.trim() || "Unknown Teacher",
        email: teacher.user.email || "",
        profileImg: teacher.user.profile_image_url || null,
        phone: teacher.user.phone || null,
        location: teacher.user.location || "India",
        subjects: teacher.subjects_taught || [],
        isSalaryAssingend: teacher.salary_assigned,
        isCurrentMonthPaid: isCurrentMonthPaid,
        salaryDetails: {
          payDay: teacher?.salary_pay_day || "NA",
          monthlySalary: teacher.monthly_salary || "NA",
        },
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching teacher salary details:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salary details",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
