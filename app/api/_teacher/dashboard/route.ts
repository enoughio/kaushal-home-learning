import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  // Get teacher ID from auth header
  const teacherId = req.headers.get("x-user-id");
  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  try {
    // Get teacher details
    const teacher = await prisma.teachers.findFirst({
      where: { user_id: Number(teacherId) },
      include: {
        user: true,
      },
    });

    if (!teacher) {
      return respondWithError({
        error: "TEACHER_NOT_FOUND",
        message: "Teacher not found",
        status: 404,
      });
    }

    // Get current month stats
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    // Parallel queries for dashboard data
    const [
      totalStudents,
      totalAssignments,
      pendingAssignments,
      completedAssignments,
      totalAttendanceMarked,
      thisMonthAttendance,
      recentAssignments,
      recentAttendance,
      salaryInfo,
    ] = await Promise.all([
      // Total students assigned
      prisma.teacher_student_assignments.count({
        where: { teacher_id: Number(teacherId) },
      }),

      // Total assignments created
      prisma.assignments.count({
        where: { teacher_id: Number(teacherId) },
      }),

      // Pending assignments (assigned but not submitted)
      prisma.assignments.count({
        where: {
          teacher_id: Number(teacherId),
          status: "assigned",
        },
      }),

      // Completed assignments (graded)
      prisma.assignments.count({
        where: {
          teacher_id: Number(teacherId),
          status: "graded",
        },
      }),

      // Total attendance records marked
      prisma.attendance.count({
        where: { teacher_id: Number(teacherId) },
      }),

      // This month's attendance
      prisma.attendance.count({
        where: {
          teacher_id: Number(teacherId),
          date: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),

      // Recent assignments (last 5)
      prisma.assignments.findMany({
        where: { teacher_id: Number(teacherId) },
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

      // Recent attendance (last 5)
      prisma.attendance.findMany({
        where: { teacher_id: Number(teacherId) },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { marked_at: "desc" },
        take: 5,
      }),

      // Salary information
      prisma.salary_payments.findFirst({
        where: {
          teacher_id: teacher.id,
          month: currentMonth,
          year: currentYear,
        },
      }),
    ]);

    // Calculate assignment completion rate
    const totalAssignmentsCreated = totalAssignments;
    const assignmentCompletionRate = totalAssignmentsCreated > 0
      ? ((completedAssignments / totalAssignmentsCreated) * 100)
      : 0;

    // Format recent assignments
    const formattedRecentAssignments = recentAssignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      studentName: `${assignment.student.user.first_name} ${assignment.student.user.last_name}`.trim(),
      status: assignment.status,
      dueDate: assignment.due_date,
      createdAt: assignment.created_at,
    }));

    // Format recent attendance
    const formattedRecentAttendance = recentAttendance.map(record => ({
      id: record.id,
      studentName: `${record.student.user.first_name} ${record.student.user.last_name}`.trim(),
      date: record.date,
      status: record.status,
      subject: record.subject,
      markedAt: record.marked_at,
    }));

    return respondWithSuccess({
      data: {
        teacher: {
          id: teacher.id,
          name: `${teacher.user.first_name} ${teacher.user.last_name}`.trim(),
          email: teacher.user.email,
          qualification: teacher.qualification,
          subjectsTaught: teacher.subjects_taught,
          monthlySalary: teacher.monthly_salary,
          currentStudents: teacher.current_students,
          rating: teacher.rating,
          totalReviews: teacher.total_reviews,
        },
        stats: {
          totalStudents,
          totalAssignments: totalAssignmentsCreated,
          pendingAssignments,
          completedAssignments,
          assignmentCompletionRate: Math.round(assignmentCompletionRate * 100) / 100,
          totalAttendanceMarked,
          thisMonthAttendance,
        },
        salary: salaryInfo ? {
          amount: salaryInfo.total_amount,
          paymentDate: salaryInfo.payment_date,
          status: salaryInfo.payment_status,
        } : null,
        recentActivity: {
          assignments: formattedRecentAssignments,
          attendance: formattedRecentAttendance,
        },
      },
    });
  } catch (error) {
    console.error("GET /teacher/dashboard error", error);
    return respondWithError({
      error: "DASHBOARD_FETCH_FAILED",
      message: "Unable to fetch dashboard data",
      status: 500,
    });
  }
}