import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const [totalSalaries, dueSalaries, activeTeachers] = await Promise.all([
      prisma.salary_payments.count(),
      prisma.salary_payments.count({
        where: {
          payment_status: "pending",
        },
      }),
      prisma.teachers.count({
        where: {
          is_active: true,
        },
      }),
    ]);

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
