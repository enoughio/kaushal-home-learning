import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

interface PaymentHistoryResponse {
  paymentId: number;
  amount: number;
  paymentType: "SALARY" | "FEE";
  paymentMethod: string;
  transactionId: string;
  paymentDate: Date;
  status: string;
  notes: string | null;
  processedBy: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const { teacherId: rawEntityId } = await params;
    const entityId = parseInt(rawEntityId, 10);

    if (isNaN(entityId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid entity ID",
        status: 400,
      });
    }

    // Get query parameters for filtering and pagination
    const searchParams = req.nextUrl.searchParams;
    const paymentType = searchParams.get("type"); // "SALARY" or "FEE"
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "10", 10);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate pagination parameters
    if (isNaN(skip) || skip < 0) {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Invalid skip parameter",
        status: 400,
      });
    }

    if (isNaN(take) || take < 1 || take > 100) {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Take parameter must be between 1 and 100",
        status: 400,
      });
    }

    // Validate payment type if provided
    if (paymentType && !["SALARY", "FEE"].includes(paymentType)) {
      return respondWithError({
        error: "VALIDATION_ERROR",
        message: "Payment type must be SALARY or FEE",
        status: 400,
      });
    }

    // Build date filter
    const dateFilter: Record<string, unknown> = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return respondWithError({
          error: "VALIDATION_ERROR",
          message: "Invalid startDate format",
          status: 400,
        });
      }
      dateFilter.gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return respondWithError({
          error: "VALIDATION_ERROR",
          message: "Invalid endDate format",
          status: 400,
        });
      }
      dateFilter.lte = end;
    }

    // Build where clause for payments
    const whereClause: Record<string, unknown> = {};
    if (paymentType) {
      whereClause.payment_type = paymentType;
    }
    if (Object.keys(dateFilter).length > 0) {
      whereClause.payment_date = dateFilter;
    }

    // Determine if entity is teacher (SALARY) or student (FEE)
    let isSalaryPayment = false;

    if (paymentType === "SALARY") {
      // Check if teacher exists
      const teacher = await prisma.teachers.findUnique({
        where: { id: entityId },
      });

      if (!teacher) {
        return respondWithError({
          error: "NOT_FOUND",
          message: "Teacher not found",
          status: 404,
        });
      }

      whereClause.salaryPaymentId = { not: null };
      // isSalaryPayment = true;
    } else if (paymentType === "FEE") {
      // Check if student exists
      const student = await prisma.students.findUnique({
        where: { id: entityId },
      });

      if (!student) {
        return respondWithError({
          error: "NOT_FOUND",
          message: "Student not found",
          status: 404,
        });
      }

      whereClause.feePaymentId = { not: null };
      // isSalaryPayment = false;
    } else {
      // No payment type specified, check if entity is teacher or student
      const teacher = await prisma.teachers.findUnique({
        where: { id: entityId },
      });

      const student = await prisma.students.findUnique({
        where: { id: entityId },
      });

      if (!teacher && !student) {
        return respondWithError({
          error: "NOT_FOUND",
          message: "Entity not found (neither teacher nor student)",
          status: 404,
        });
      }

      // Include both types if entity can have both (shouldn't happen, but safe)
      whereClause.OR = [
        { salaryPaymentId: { not: null } },
        { feePaymentId: { not: null } },
      ];
    }

    // Fetch payment history with related data
    const payments = await prisma.payments.findMany({
      where: whereClause,
      include: {
        processedBy: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        salaryPayment: paymentType === "SALARY" || !paymentType,
        feePayment: paymentType === "FEE" || !paymentType,
      },
      orderBy: {
        payment_date: "desc",
      },
      skip,
      take,
    });

    // Get total count for pagination
    const totalCount = await prisma.payments.count({
      where: whereClause,
    });

    // Format response
    const formattedPayments: PaymentHistoryResponse[] = payments.map((payment) => ({
      paymentId: payment.id,
      amount: payment.amount,
      paymentType: payment.payment_type,
      paymentMethod: payment.payment_method,
      transactionId: payment.transactionId,
      paymentDate: payment.payment_date,
      status: payment.status,
      notes: payment.notes,
      processedBy: payment.processedBy
        ? {
            id: payment.processedBy.id,
            name: `${payment.processedBy.first_name || ""} ${payment.processedBy.last_name || ""}`.trim(),
            email: payment.processedBy.email,
          }
        : null,
      createdAt: payment.created_at,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / take);
    const currentPage = Math.floor(skip / take) + 1;

    return respondWithSuccess({
      data: {
        teacherId : entityId,
        payments: formattedPayments,
        pagination: {
          total: totalCount,
          page: currentPage,
          pageSize: take,
          totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        },
      },
      message: "Payment history retrieved successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Payment history fetch error:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve payment history",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
