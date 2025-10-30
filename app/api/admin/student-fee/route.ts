import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "../../_lib/verify";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim(); // search by user name, id or location or email
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const skip = (page - 1) * limit;
    const where: any = {
      user: {
        is_active: true,
      },
      fee_assigned: true,
    };

    if (search) {
      where.user = {
        OR: [
          { id: { contains: search, case: "insenstive" } },
          { first_name: { contains: search, case: "insenstive" } },
          { last_name: { contains: search, case: "insenstive" } },
          { email: { contains: search, case: "insenstive" } },
          { location: { contains: search, case: "insenstive" } },
        ],
      };
    }

    const [studentsData, studentsFeeData, totalStudentFeeData, ] = await Promise.all([
      
      prisma.students.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          monthly_fee: true,
          fee_due_date: true,
          last_fee_payment_date: true,

          user: {
            select: {
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),


      prisma.feePayment.findMany({
        where : { //fetch only current month fee payments
          created_at : { gte : new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        },

        select : {
          id: true,
          status: true,
          date: true,
         due_date: true,
        reminder_sent: true,
          student: {
            select: {
              id: true,
              fee_due_date: true,
            }
          }

        },
        orderBy: { created_at: "desc" },
      }),

      
      prisma.students.count({
        where : where
      }),
    
    ]);
    

    const studentsIds = studentsFeeData.map( (fee) => fee.student.id );
    // for liner time search
    const idSet = new Set(studentsIds);

    // you will be need a cron job for this
    const formattedFees = studentsData.map((st) => {

      const now = new Date();
      const lastPaymentDate = st.last_fee_payment_date;
      
      const feeStatus = 
        lastPaymentDate && lastPaymentDate.getMonth() === now.getMonth() && lastPaymentDate.getFullYear() === now.getFullYear()
      
      const feeRecoredAvailable = idSet.has(st.id);


      return {
        //  id: fee.id.toString(),
        studentId: st.id.toString(),
        studentName: `${st.user.first_name || ""} ${
          st.user.last_name || ""
        }`.trim(),
        fee: st.monthly_fee || 0,
        status: feeRecoredAvailable  ? studentsFeeData.fee.status : feeStatus ? "PAID" : "DUE",
        paidOn: feeRecoredAvailable && studentsFeeData.fee.date .toISOString(),
        ReminderSent: st. .reminder_sent,
        dueDate: fee.student.fee_due_date.toISOString(),
      };
    });

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
