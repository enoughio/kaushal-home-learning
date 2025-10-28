// app/api/admin/teacher-salary/[teacherId]/route.ts
import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify"; 

export async function GET(
  req: NextRequest,
  { params }: { params: { teacherId: string } }
) {
  try {
  
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const teacherId = parseInt(params.teacherId, 10);
    
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
        salary_payments: {
          orderBy: [
            { year: "desc" },
            { month: "desc" },
          ],
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

    // === 3. Determine Current Month Salary ===
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // Find salary payment for current month (if exists)
    const currentMonthPayment = teacher.salary_payments.find(
      (p) => p.month === currentMonth && p.year === currentYear
    );

    // // Latest payment (most recent month, may or may not be current month)
    // const latestPayment = teacher.salary_payments[0];

    // === 4. Build Salary Details ===
    const salaryDetails = {
      baseSalary: teacher.monthly_salary.toFixed(2),
      bonus: currentMonthPayment?.bonus.toFixed(2) || "0.00",
      totalSalary: (
        teacher.monthly_salary + (currentMonthPayment?.bonus || 0)
      ).toFixed(2),
      MonthPaidDate: currentMonthPayment?.payment_date?.toISOString() || null,
    };

    // === 5. Build Salary History ===
    const salaryHistory = teacher.salary_payments.map((payment) => {
      const monthName = new Date(payment.year, payment.month - 1, 1)
        .toLocaleString("default", { month: "short" });

      return {
        month: monthName,
        baseSalary: payment.base_salary.toFixed(2),
        bonus: payment.bonus.toFixed(2),
        totalSalary: payment.total_amount.toFixed(2),
        paidDate: payment.payment_date?.toISOString() || null,
        status: payment.payment_status,
      };
    });

    // === 6. Final Response ===
    return respondWithSuccess({
      data: {
        teacherId: teacher.id.toString(),
        name: `${teacher.user.first_name || ""} ${teacher.user.last_name || ""}`.trim() || "Unknown Teacher",
        email: teacher.user.email || "",
        profileImg: teacher.user.profile_image_url || null,
        phone: teacher.user.phone || null,
        location: teacher.user.location || "India",
        subjects: teacher.subjects_taught || [],
        salaryDetails,
        salaryHistory,
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