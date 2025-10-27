import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const skip = (page - 1) * limit;

    const [fees, totalFees] = await Promise.all([
      prisma.student_fees.findMany({
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
      prisma.student_fees.count(),
    ]);

    const formattedFees = fees.map((fee) => ({
      id: fee.id.toString(),
      studentId: fee.student.id.toString(),
      studentName: `${fee.student.user.first_name || ""} ${fee.student.user.last_name || ""}`.trim(),
      fee: fee.amount,
      status: fee.status,
      date: fee.created_at.toISOString(),
      ReminderSent: fee.reminder_sent,
      dueDate: fee.due_date.toISOString(),
    }));

    const totalPages = Math.ceil(totalFees / limit);

    return respondWithSuccess({
      data: {
        studentFees: formattedFees,
        page,
        totalPages,
        totalFees,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch student fees",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
