import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  try {
    // Get current month stats
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    // Parallel queries for dashboard data
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      pendingTeachers,
      totalAssignments,
      totalAttendance,
      totalPayments,
      thisMonthPayments,
      pendingFees,
      recentUsers,
      recentPayments,
      systemHealth,
    ] = await Promise.all([
      // Total users
      prisma.users.count(),

      // Total teachers
      prisma.teachers.count({
        where: { approval_status: "approved" },
      }),

      // Total students
      prisma.students.count({
        where: { is_active: true },
      }),

      // Pending teacher approvals
      prisma.teachers.count({
        where: { approval_status: "pending" },
      }),

      // Total assignments
      prisma.assignments.count(),

      // Total attendance records
      prisma.attendance.count(),

      // Total payments
      prisma.payments.count(),

      // This month's payments
      prisma.payments.count({
        where: {
          payment_date: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),

      // Pending fees
      prisma.student_fees.count({
        where: { status: "due" },
      }),

      // Recent users (last 5)
      prisma.users.findMany({
        where: { is_deleted: false },
        orderBy: { created_at: "desc" },
        take: 5,
      }),

      // Recent payments (last 5)
      prisma.payments.findMany({
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: 5,
      }),

      // System health check (count of active records)
      Promise.all([
        prisma.users.count({ where: { is_active: true } }),
        prisma.teachers.count({ where: { is_active: true } }),
        prisma.students.count({ where: { is_active: true } }),
      ]),
    ]);

    // Calculate payment totals
    const paymentStats = await prisma.payments.aggregate({
      where: {
        payment_status: "completed",
        payment_date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      _sum: { amount: true },
      _count: true,
    });

    // Calculate monthly revenue
    const monthlyRevenue = paymentStats._sum.amount || 0;
    const monthlyTransactions = paymentStats._count;

    // Format recent users
    const formattedRecentUsers = recentUsers.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
    }));

    // Format recent payments
    const formattedRecentPayments = recentPayments.map(payment => ({
      id: payment.id,
      studentName: `${payment.student.user.first_name} ${payment.student.user.last_name}`.trim(),
      amount: payment.amount,
      paymentType: payment.payment_type,
      paymentStatus: payment.payment_status,
      paymentDate: payment.payment_date,
      createdAt: payment.created_at,
    }));

    const [activeUsers, activeTeachers, activeStudents] = systemHealth;

    return respondWithSuccess({
      data: {
        overview: {
          totalUsers,
          totalTeachers,
          totalStudents,
          pendingTeachers,
          totalAssignments,
          totalAttendance,
          totalPayments,
          pendingFees,
        },
        monthlyStats: {
          paymentsThisMonth: thisMonthPayments,
          monthlyRevenue,
          monthlyTransactions,
        },
        systemHealth: {
          activeUsers,
          activeTeachers,
          activeStudents,
          systemStatus: "healthy", // Could be enhanced with more checks
        },
        recentActivity: {
          users: formattedRecentUsers,
          payments: formattedRecentPayments,
        },
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