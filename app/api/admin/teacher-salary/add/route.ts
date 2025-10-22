import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

type AddSalaryPayload = {
  teacherId: number;
  monthlySalary: number;
  salaryPayDay: number;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  accountHolderName?: string;
};

export async function POST(req: NextRequest) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  let payload: AddSalaryPayload;
  try {
    payload = await req.json();
  } catch (error) {
    return respondWithError({
      error: "INVALID_JSON",
      message: "Request body must be valid JSON",
      status: 400,
    });
  }

  const {
    teacherId,
    monthlySalary,
    salaryPayDay,
    bankAccountNumber,
    bankIfscCode,
    bankName,
    accountHolderName,
  } = payload;

  if (!teacherId || !Number.isInteger(teacherId) || teacherId <= 0) {
    return respondWithError({
      error: "INVALID_TEACHER_ID",
      message: "Valid teacher id is required",
      status: 400,
    });
  }

  if (!monthlySalary || monthlySalary <= 0) {
    return respondWithError({
      error: "INVALID_SALARY",
      message: "Monthly salary must be greater than 0",
      status: 400,
    });
  }

  if (!salaryPayDay || salaryPayDay < 1 || salaryPayDay > 31) {
    return respondWithError({
      error: "INVALID_PAY_DAY",
      message: "Salary pay day must be between 1 and 31",
      status: 400,
    });
  }

  try {
    const teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!teacher) {
      return respondWithError({
        error: "TEACHER_NOT_FOUND",
        message: "The requested teacher does not exist",
        status: 404,
      });
    }

    const updatedTeacher = await prisma.teachers.update({
      where: { id: teacherId },
      data: {
        monthly_salary: monthlySalary,
        salary_pay_day: salaryPayDay,
        bank_account_number: bankAccountNumber,
        bank_ifsc_code: bankIfscCode,
        bank_name: bankName,
        account_holder_name: accountHolderName,
        updated_at: new Date(),
      },
    });

    return respondWithSuccess({
      data: {
        teacherId: updatedTeacher.id,
        monthlySalary: updatedTeacher.monthly_salary,
        salaryPayDay: updatedTeacher.salary_pay_day,
        bankAccountNumber: updatedTeacher.bank_account_number,
        bankName: updatedTeacher.bank_name,
      },
      message: "Teacher salary record added successfully",
    });
  } catch (error) {
    console.error("POST /admin/teacher-salary/add error", error);
    return respondWithError({
      error: "SALARY_ADD_FAILED",
      message: "Unable to add teacher salary record",
      status: 500,
    });
  }
}