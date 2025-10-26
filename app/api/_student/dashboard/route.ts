import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "student");
  } catch (error) {
    return error as Response;
  }

  // Get student ID from auth header
  const studentId = req.headers.get("x-user-id");
  if (!studentId) {
    return respondWithError({
      error: "STUDENT_ID_MISSING",
      message: "Student ID not found in request",
      status: 400,
    });
  }

  try {
    // Get student details
    const student = await prisma.students.findFirst({
      where: { user_id: Number(studentId) },
      include: {
        user: true,
      },
    });

    if (!student) {
      return respondWithError({
        error: "STUDENT_NOT_FOUND",
        message: "Student not found",
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
      totalTeachers,
      totalAssignments,
      pendingAssignments,
      submittedAssignments,
      gradedAssignments,
      totalAttendance,
      thisMonthAttendance,
      recentAssignments,
      recentAttendance,
      currentFeeStatus,
    ] = await Promise.all([
      // Total teachers assigned
      prisma.teacher_student_assignments.count({
        where: { student_id: Number(studentId) },
      }),

      // Total assignments received
      prisma.assignments.count({
        where: { student_id: Number(studentId) },
      }),

      // Pending assignments (assigned but not submitted)
      prisma.assignments.count({
        where: {
          student_id: Number(studentId),
          status: "assigned",
        },
      }),

      // Submitted assignments
      prisma.assignments.count({
        where: {
          student_id: Number(studentId),
          status: "submitted",
        },
      }),

      // Graded assignments
      prisma.assignments.count({
        where: {
          student_id: Number(studentId),
          status: "graded",
        },
      }),

      // Total attendance records
      prisma.attendance.count({
        where: { student_id: Number(studentId) },
      }),

      // This month's attendance
      prisma.attendance.count({
        where: {
          student_id: Number(studentId),
          date: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      }),

      // Recent assignments (last 5)
      prisma.assignments.findMany({
        where: { student_id: Number(studentId) },
        include: {
          teacher: {
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
        where: { student_id: Number(studentId) },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { marked_at: "desc" },
        take: 5,
      }),

      // Current fee status
      prisma.student_fees.findFirst({
        where: {
          student_id: student.id,
          month: currentMonth,
          year: currentYear,
        },
      }),
    ]);

    // Calculate assignment submission rate
    const totalAssignmentsReceived = totalAssignments;
    const assignmentSubmissionRate = totalAssignmentsReceived > 0
      ? ((submittedAssignments + gradedAssignments) / totalAssignmentsReceived) * 100
      : 0;

    // Format recent assignments
    const formattedRecentAssignments = recentAssignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      teacherName: `${assignment.teacher.user.first_name} ${assignment.teacher.user.last_name}`.trim(),
      status: assignment.status,
      dueDate: assignment.due_date,
      createdAt: assignment.created_at,
    }));

    // Format recent attendance
    const formattedRecentAttendance = recentAttendance.map(record => ({
      id: record.id,
      teacherName: `${record.teacher.user.first_name} ${record.teacher.user.last_name}`.trim(),
      date: record.date,
      status: record.status,
      subject: record.subject,
      markedAt: record.marked_at,
    }));

    return respondWithSuccess({
      data: {
        student: {
          id: student.id,
          name: `${student.user.first_name} ${student.user.last_name}`.trim(),
          email: student.user.email,
          grade: student.grade,
          schoolName: student.school_name,
          monthlyFee: student.monthly_fee,
          enrollmentDate: student.enrollment_date,
          isActive: student.is_active,
        },
        stats: {
          totalTeachers,
          totalAssignments: totalAssignmentsReceived,
          pendingAssignments,
          submittedAssignments,
          gradedAssignments,
          assignmentSubmissionRate: Math.round(assignmentSubmissionRate * 100) / 100,
          totalAttendance,
          thisMonthAttendance,
        },
        currentFee: currentFeeStatus ? {
          amount: currentFeeStatus.amount,
          dueDate: currentFeeStatus.due_date,
          status: currentFeeStatus.status,
          reminderSent: currentFeeStatus.reminder_sent,
        } : null,
        recentActivity: {
          assignments: formattedRecentAssignments,
          attendance: formattedRecentAttendance,
        },
      },
    });
  } catch (error) {
    console.error("GET /student/dashboard error", error);
    return respondWithError({
      error: "DASHBOARD_FETCH_FAILED",
      message: "Unable to fetch dashboard data",
      status: 500,
    });
  }
}