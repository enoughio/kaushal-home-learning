import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const data = await params
    const paymentId = parseInt(data.paymentId);

    if (isNaN(paymentId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid payment ID",
        status: 400,
      });
    }

    const payment = await prisma.payments.findUnique({
      where: { id: paymentId },

      include: {
        feePayment: {
          include : {
            student : {
              include : {
                user : {
                  select : {
                    id : true, 
                    first_name : true,
                    last_name : true,
                    email : true,
                    profile_image_url : true,
                    phone : true,
                    location : true
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
                    email : true,
                    profile_image_url : true,
                    phone : true,
                    location : true,
                    role : true
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!payment) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Payment not found",
        status: 404,
      });
    }

    const userId = payment.payment_type == "FEE" ? payment.feePayment?.student.user_id : payment.salaryPayment?.teacher.user_id ;
    const name =   payment.payment_type == "FEE" ?  `${payment.feePayment?.student.user.first_name || ""} ${payment.feePayment?.student.user.last_name || ""}`.trim() : `${payment.salaryPayment?.teacher.user.first_name || ""} ${payment.salaryPayment?.teacher.user.last_name || ""}`.trim();

    return respondWithSuccess({
      data: {
        id: payment.id.toString(),
        userId,
        userName : name,
        type: payment.payment_type,
        amount: payment.amount,
        status: payment.status,
        date: payment.payment_date?.toISOString() || new Date().toISOString(),
        dueDate: payment.payment_type == "FEE" ? payment.feePayment?.due_date?.toISOString() || new Date().toISOString() :  "NA" ,
        method: payment.payment_method,
        transactionId: payment.transactionId || "",
        processed: payment.processedById || "",
        UserDetails: {
          id: userId,
          name,
          email:  payment.salaryPayment?.teacher.user.email ,
          profileImg: payment.salaryPayment?.teacher.user.profile_image_url || "https://example.com/photo.jpg",
          phone: payment.salaryPayment?.teacher.user.phone || "",
          location: payment.salaryPayment?.teacher.user.location || "",
          role: payment.salaryPayment?.teacher.user.role,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch payment details",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
