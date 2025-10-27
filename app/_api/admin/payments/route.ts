import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};
    if (type) whereClause.payment_type = type;
    if (status) whereClause.payment_status = status;

    const [payments, totalPayments] = await Promise.all([
      prisma.payments.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.payments.count({ where: whereClause }),
    ]);

    const formattedPayments = payments.map((payment) => ({
      id: payment.id.toString(),
      userId: payment.student.user_id.toString(),
      userName: `${payment.student.user.first_name || ""} ${payment.student.user.last_name || ""}`.trim(),
      type: payment.payment_type,
      amount: payment.amount,
      status: payment.payment_status,
      date: payment.payment_date?.toISOString() || new Date().toISOString(),
      dueDate: payment.due_date?.toISOString() || new Date().toISOString(),
      method: payment.payment_method || "cash",
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
