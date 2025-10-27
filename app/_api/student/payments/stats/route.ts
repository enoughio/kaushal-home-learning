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

    // Get total fees
    const totalFeesResult = await prisma.student_fees.aggregate({
      _sum: { amount: true },
      where: { student_id: student.id },
    });

    // Get due fees
    const dueFeeResult = await prisma.student_fees.aggregate({
      _sum: { amount: true },
      where: {
        student_id: student.id,
        status: "due",
      },
    });

    return respondWithSuccess({
      data: {
        totalFees: Math.round(totalFeesResult._sum?.amount || 0),
        dueFees: Math.round(dueFeeResult._sum?.amount || 0),
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch payment statistics",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
