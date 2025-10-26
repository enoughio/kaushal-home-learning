import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, baseSalary, bonus, payDay } = body;

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
        monthly_salary: baseSalary,
        salary_pay_day: payDay || 1,
      },
    });

    return respondWithSuccess({
      data: {
        message: "Salary record added successfully",
        teacherId: teacher.id.toString(),
        salaryDetails: {
          baseSalary,
          bonus: bonus || 0,
          totalSalary: baseSalary + (bonus || 0),
          payDay: payDay || 1,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to add salary record",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
