import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";

export async function GET(req: NextRequest) {

  try {
    // Get current month stats
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const lastYearStart = new Date(currentYear - 1, 0, 1);
    const lastYearEnd = new Date(currentYear, 0, 1);
    const lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth - 1, 1);

    // Parallel queries for dashboard data
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      pendingTeachers,
      totalRevenueAgg,
      currentMonthUsers,
      lastMonthUsers,
      thisYearRevenueAgg,
      lastYearRevenueAgg,
    ] = await Promise.all([
      // Total users
      prisma.users.count(),

      // Total approved teachers
      prisma.teachers.count({
        where: { approval_status: "approved" },
      }),

      // Total active students
      prisma.students.count({
        where: { is_active: true },
      }),

      // Pending teacher approvals
      prisma.teachers.count({
        where: { approval_status: "pending" },
      }),

      // Total revenue
      prisma.payments.aggregate({
        where: { payment_status: "completed" },
        _sum: { amount: true }
      }),

      // Users created this month
      prisma.users.count({
        where: {
          created_at: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),

      // Users created last month
      prisma.users.count({
        where: {
          created_at: {
            gte: lastMonthStart,
            lt: lastMonthEnd,
          },
        },
      }),

      // This year's revenue
      prisma.payments.aggregate({
        where: {
          payment_status: "completed",
          payment_date: {
            gte: startOfYear,
            lt: endOfYear,
          },
        },
        _sum: { amount: true }
      }),

      // Last year's revenue
      prisma.payments.aggregate({
        where: {
          payment_status: "completed",
          payment_date: {
            gte: lastYearStart,
            lt: lastYearEnd,
          },
        },
        _sum: { amount: true }
      }),
    ]);

    // Extract aggregated values
    const totalRevenue = totalRevenueAgg._sum.amount || 0;
    const thisYearRevenue = thisYearRevenueAgg._sum.amount || 0;
    const lastYearRevenue = lastYearRevenueAgg._sum.amount || 0;

    // Calculate growth percentages
    const monthlyGrowth = lastMonthUsers > 0 ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0;
    const yearlyGrowth = lastYearRevenue > 0 ? ((thisYearRevenue - lastYearRevenue) / lastYearRevenue * 100) : 0;

    return respondWithSuccess({
      data: {
        totalUsers,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
        approvedTeachers: totalTeachers,
        pendingTeachers,
        totalRevenue,
        yearlyGrowth: Math.round(yearlyGrowth * 100) / 100,
        totalStudents,
      },
    });
  } catch (error) {
    console.error("GET /admin/dashboard error", error);
    return respondWithError({
      error: "DASHBOARD_FETCH_FAILED",
      message: "Unable to fetch dashboard data",
      status: 500,
    });
  }
}