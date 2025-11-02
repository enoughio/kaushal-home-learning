// import { NextRequest } from "next/server";
// import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
// import { prisma } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     // Get total student fees
//     const studentFeesResult = await prisma.payments.aggregate({
//       _sum: { amount: true },
//       where: {
//         payment_type: "monthly_fee",
//         payment_status: "completed",
//       },
//     });

//     // Get total teacher salaries
//     const teacherSalariesResult = await prisma.salary_payments.aggregate({
//       _sum: { total_amount: true },
//       where: {
//         payment_status: "completed",
//       },
//     });

//     const totalPayments = {
//       studentFees: Math.round(studentFeesResult._sum?.amount || 0),
//       teacherSalaries: Math.round(teacherSalariesResult._sum?.total_amount || 0),
//     };

//     return respondWithSuccess({
//       data: {
//         totalPayments,
//       },
//       status: 200,
//     });
//   } catch (error) {
//     return respondWithError({
//       error: "INTERNAL_SERVER_ERROR",
//       message: "Failed to fetch total payments",
//       status: 500,
//       details: error instanceof Error ? error.message : undefined,
//     });
//   }
// }


export async function GET() {
  return new Response("Total Payments Endpoint");
}