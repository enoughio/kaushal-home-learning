import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { authenticateAndValidateAdmin } from "../../_lib/verify";


export async function GET(req: NextRequest) {
  try {

    const authResult = await authenticateAndValidateAdmin(req)
    if( "error" in authResult) return authResult.error
    
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const type = searchParams.get("type");
    // const search = searchParams.get("search");
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};
    if (type) whereClause.payment_type = type;
    if (status) whereClause.status = status;
    // if (search) whereClause. = status;

    const [payments, totalPayments] = await Promise.all([
      
      prisma.payments.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          feePayment : {
            include : {
              student : {
                include : {
                  user : {
                    select : {
                      id : true,
                      first_name : true,
                      last_name : true,
                      role : true
                    }
                  }
                }
              }
            }
          },
          salaryPayment : {
            include : {
              teacher : {
                include : {
                  user : {
                    select : {
                      id : true,
                      first_name : true,
                      last_name : true,
                      role : true
                    }
                  }
                }
              }
            }
          },
        },
        orderBy: { created_at: "desc" },
      }),


      prisma.payments.count({
        where : whereClause
      })
    ]);


    const formattedPayments = payments.map((payment) => ({
      id: payment.id.toString(),
      userId: payment.payment_type == "FEE" ? payment.feePayment?.studentId : payment.salaryPayment?.teacherId ,
      userName:  payment.payment_type == "FEE" ? `${payment.feePayment?.student.user.first_name} ${payment.feePayment?.student.user.last_name}`  : `${payment.salaryPayment?.teacher.user.first_name} ${payment.salaryPayment?.teacher.user.last_name}`,
      type: payment.payment_type,
      amount: payment.amount,
      transactionId : payment.transactionId,
      status: payment.status,
      date: payment.payment_date?.toISOString() || new Date().toISOString(),
      // : payment.payment_date?.toISOString() || new Date().toISOString(),
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
