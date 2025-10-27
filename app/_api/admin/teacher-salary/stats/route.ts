import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const totalSalaries = await prisma.salary_payments.count();
    
    const dueSalaries = await prisma.salary_payments.count({
      where: {
        payment_status: "pending",
      },
    });

    const activeTeachers = await prisma.teachers.count({
      where: {
        is_active: true,
      },
    });

    return respondWithSuccess({
      data: {
        totalSalaries,
        dueSalaries,
        activeTeachers,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher salary statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
