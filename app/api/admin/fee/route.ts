import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    // const authResult = await authenticateAndValidateAdmin(req);
    // if ("error" in authResult) return authResult.error;

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim(); // search by user name, id or location or email
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const skip = (page - 1) * limit;

    
    const where : Prisma.studentsWhereInput = {  };
    where.is_active = true;

    if (search) {
      where.user = {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ]
      };
    }

    const [studentsData, studentsFeeData, totalStudentFeeData] = await Promise.all([
      prisma.students.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          monthly_fee: true,
          fee_due_date: true,
          last_fee_payment_date: true,
          fee_assigned: true,

          user: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
              phone: true,
              location: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),

      prisma.feePayment.findMany({
        where: {
          //fetch only current month fee payments
          created_at: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },

        select: {
          id: true,
          status: true,
          paidAt: true,
          due_date: true,
          reminder_sent: true,
          
          student: {
            select: {
              id: true,
              fee_due_date: true,

            },
          },
        },
        orderBy: { created_at: "desc" },
      }),

      prisma.students.count({
        where: where,
      }),
    ]);

    // for liner time search
    const feeRecordMap = new Map(
      studentsFeeData.map((fee) => [fee.student.id, fee])
    );

    const formattedFees = studentsData.map((st) => {
      const now = new Date();
      const lastPaymentDate = st.last_fee_payment_date;

      const feeStatus =
        lastPaymentDate &&
        lastPaymentDate.getMonth() === now.getMonth() &&
        lastPaymentDate.getFullYear() === now.getFullYear();

      const feeRecord = feeRecordMap.get(st.id);

      return {
        studentId: st.id.toString(),
        feeAssigned: st.fee_assigned,
        studentName: `${st.user.first_name || ""} ${st.user.last_name || ""}`.trim(),
        parentEmail: st.user.email,
        parentPhone: st.user.phone || "NA",
        fee: st.monthly_fee || 0,
        status: feeRecord ? feeRecord.status : feeStatus ? "PAID" : "DUE",
        paidOn: feeRecord?.paidAt?.toISOString() || "NA",
        ReminderSent: feeRecord?.reminder_sent || 0,
        dueDate: st.fee_due_date?.toISOString() || "NA",
      };
    });

    const totalPages = Math.ceil(totalStudentFeeData / limit);
    return respondWithSuccess({
      data: {
        studentFees: formattedFees,
        page,
        totalPages,
        totalStudentFeeData,
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
