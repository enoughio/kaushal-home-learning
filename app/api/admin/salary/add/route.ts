import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";


// add salary record for a teacher
export async function POST(req: NextRequest) {
  try {
    
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const body = await req.json();
    const { teacherId, baseSalary, payDay } = body;

    if (!teacherId || !baseSalary) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "teacherId and baseSalary are required",
        status: 400,
      });
    }

    const teacher = await prisma.teachers.findUnique({
      where: { id: parseInt(teacherId) },
      include: { user: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    // Update teacher with salary information
    const updatedTeacher = await prisma.teachers.update({
      where: { id: parseInt(teacherId) },
      data: {
        salary_assigned : true,
        monthly_salary: baseSalary,
        salary_pay_day: payDay || 1,
      },
    });

    return respondWithSuccess({
      data: {
        message: "Salary record updated successfully",
        teacherId: teacher.id.toString(),
        salaryDetails: {
          baseSalary : updatedTeacher.monthly_salary,
          payDay: updatedTeacher.salary_pay_day,
        },
      },
      status: 200,
    });

  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to update salary record",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
