import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";

type PaySalaryPayload = {
  month: number;
  year: number;
  bonus?: number;
  deductions?: number;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
};

export async function GET(req: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const teacherId = Number(params.teacherId);
  if (!Number.isInteger(teacherId) || teacherId <= 0) {
    return respondWithError({
      error: "INVALID_TEACHER_ID",
      message: "Teacher id must be a positive integer",
      status: 400,
    });
  }

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });

  try {
    const teacher = await prisma.teachers.findUnique({
      where: { id: teacherId },
      include: {
        user: true,
        salary_payments: {
          orderBy: { created_at: "desc" },
          skip,
          take: limit,
        },
      },
    });

    if (!teacher) {
      return respondWithError({
        error: "TEACHER_NOT_FOUND",
        message: "The requested teacher does not exist",
        status: 404,
      });
    }

    const totalPayments = await prisma.salary_payments.count({
      where: { teacher_id: teacherId },
    });

    const salaryHistory = teacher.salary_payments.map((payment) => ({
      id: payment.id,
      month: payment.month,
      year: payment.year,
      baseSalary: payment.base_salary,
      bonus: payment.bonus,
      deductions: payment.deductions,
      totalAmount: payment.total_amount,
      paymentStatus: payment.payment_status,
      paymentDate: payment.payment_date,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      notes: payment.notes,
      processedBy: payment.processed_by,
      createdAt: payment.created_at,
    }));

    return respondWithSuccess({
      data: {
        teacher: {
          id: teacher.id,
          name: `${teacher.user.first_name} ${teacher.user.last_name}`.trim(),
          email: teacher.user.email,
          monthlySalary: teacher.monthly_salary,
          salaryPayDay: teacher.salary_pay_day,
          bankAccountNumber: teacher.bank_account_number,
          bankName: teacher.bank_name,
        },
        salaryHistory,
        pagination: {
          page,
          limit,
          total: totalPayments,
          totalPages: Math.ceil(totalPayments / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /admin/teacher-salary/:teacherId error", error);
    return respondWithError({
      error: "TEACHER_SALARY_FETCH_FAILED",
      message: "Unable to fetch teacher salary details",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const teacherId = Number(params.teacherId);
  if (!Number.isInteger(teacherId) || teacherId <= 0) {
    return respondWithError({
      error: "INVALID_TEACHER_ID",
      message: "Teacher id must be a positive integer",
      status: 400,
    });
  }

  let payload: PaySalaryPayload;
  try {
    payload = await req.json();
  } catch (error) {
    return respondWithError({
      error: "INVALID_JSON",
      message: "Request body must be valid JSON",
      status: 400,
    });
  }

  const { month, year, bonus = 0, deductions = 0, paymentMethod, transactionId, notes } = payload;

  if (!month || !year || month < 1 || month > 12 || year < 2020) {
    return respondWithError({
      error: "INVALID_MONTH_YEAR",
      message: "Valid month (1-12) and year (>= 2020) are required",
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

    // Check if salary already paid for this month/year
    const existingPayment = await prisma.salary_payments.findUnique({
      where: {
        teacher_id_month_year: {
          teacher_id: teacherId,
          month,
          year,
        },
      },
    });

    if (existingPayment && existingPayment.payment_status === "completed") {
      return respondWithError({
        error: "SALARY_ALREADY_PAID",
        message: "Salary has already been paid for this month",
        status: 409,
      });
    }

    const adminUser = requireRole(req, "admin");
    const baseSalary = teacher.monthly_salary;
    const totalAmount = baseSalary + bonus - deductions;

    const result = await prisma.$transaction(async (tx) => {
      let payment;
      if (existingPayment) {
        // Update existing pending payment
        payment = await tx.salary_payments.update({
          where: { id: existingPayment.id },
          data: {
            base_salary: baseSalary,
            bonus,
            deductions,
            total_amount: totalAmount,
            payment_status: "completed",
            payment_date: new Date(),
            payment_method: paymentMethod,
            transaction_id: transactionId,
            notes,
            processed_by: adminUser.id,
            updated_at: new Date(),
          },
        });
      } else {
        // Create new payment
        payment = await tx.salary_payments.create({
          data: {
            teacher_id: teacherId,
            month,
            year,
            base_salary: baseSalary,
            bonus,
            deductions,
            total_amount: totalAmount,
            payment_status: "completed",
            payment_date: new Date(),
            payment_method: paymentMethod,
            transaction_id: transactionId,
            notes,
            processed_by: adminUser.id,
          },
        });
      }

      // Update teacher's last paid info
      await tx.teachers.update({
        where: { id: teacherId },
        data: {
          updated_at: new Date(),
        },
      });

      return payment;
    });

    return respondWithSuccess({
      data: {
        paymentId: result.id,
        teacherId,
        month,
        year,
        totalAmount,
        paymentDate: result.payment_date,
      },
      message: "Teacher salary paid successfully",
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("POST /admin/teacher-salary/:teacherId/pay error", error);
    return respondWithError({
      error: "SALARY_PAYMENT_FAILED",
      message: "Unable to process salary payment",
      status: 500,
    });
  }
}