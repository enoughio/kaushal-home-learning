import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only students can access this endpoint",
        status: 403,
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const student = await prisma.students.findFirst({
      where: { user_id: user.id },
    });

    if (!student) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Student profile not found",
        status: 404,
      });
    }

    const [payments, totalPayments] = await Promise.all([
      prisma.payments.findMany({
        where: { student_id: student.id },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.payments.count({ where: { student_id: student.id } }),
    ]);

    const formattedPayments = payments.map((payment) => ({
      id: payment.id.toString(),
      type: payment.payment_type,
      amount: payment.amount,
      status: payment.payment_status,
      date: payment.payment_date?.toISOString() || new Date().toISOString(),
      dueDate: payment.due_date?.toISOString() || new Date().toISOString(),
      method: payment.payment_method || "cash",
      transactionId: payment.transaction_id || "",
    }));

    const totalPages = Math.ceil(totalPayments / limit);

    return respondWithSuccess({
      data: {
        payments: formattedPayments,
        page,
        totalPages,
        totalPayments,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch payments",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
