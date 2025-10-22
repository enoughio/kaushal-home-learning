import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });
  const studentId = searchParams.get("studentId");
  const date = searchParams.get("date");
  const subject = searchParams.get("subject");

  // Get teacher ID from auth header
  const teacherId = req.headers.get("x-user-id");
  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  const where: any = { teacher_id: Number(teacherId) };
  if (studentId && !isNaN(Number(studentId))) {
    where.student_id = Number(studentId);
  }
  if (date) {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      where.date = dateObj;
    }
  }
  if (subject) {
    where.subject = subject;
  }

  try {
    const [total, attendanceRecords] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.findMany({
        where,
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const attendanceList = attendanceRecords.map((record) => ({
      id: record.id,
      studentId: record.student_id,
      studentName: `${record.student.user.first_name} ${record.student.user.last_name}`.trim(),
      date: record.date,
      status: record.status,
      subject: record.subject,
      sessionDuration: record.session_duration,
      notes: record.notes,
      latitude: record.latitude,
      longitude: record.longitude,
      markedAt: record.marked_at,
    }));

    return respondWithSuccess({
      data: {
        attendance: attendanceList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /teacher/attendance error", error);
    return respondWithError({
      error: "ATTENDANCE_FETCH_FAILED",
      message: "Unable to fetch attendance records",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireRole(req, "teacher");
  } catch (error) {
    return error as Response;
  }

  const teacherId = req.headers.get("x-user-id");
  if (!teacherId) {
    return respondWithError({
      error: "TEACHER_ID_MISSING",
      message: "Teacher ID not found in request",
      status: 400,
    });
  }

  try {
    const body = await req.json();
    const { studentId, date, status, subject, sessionDuration, notes, latitude, longitude } = body;

    // Validate required fields
    if (!studentId || isNaN(Number(studentId))) {
      return respondWithError({
        error: "INVALID_STUDENT_ID",
        message: "Valid student ID is required",
        status: 400,
      });
    }

    if (!date) {
      return respondWithError({
        error: "DATE_REQUIRED",
        message: "Date is required",
        status: 400,
      });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return respondWithError({
        error: "INVALID_DATE",
        message: "Invalid date format",
        status: 400,
      });
    }

    if (!status || !["present", "absent", "late", "excused"].includes(status)) {
      return respondWithError({
        error: "INVALID_STATUS",
        message: "Status must be one of: present, absent, late, excused",
        status: 400,
      });
    }

    // Verify teacher-student assignment exists
    const teacherStudentAssignment = await prisma.teacher_student_assignments.findFirst({
      where: {
        teacher_id: Number(teacherId),
        student_id: Number(studentId),
      },
    });

    if (!teacherStudentAssignment) {
      return respondWithError({
        error: "INVALID_ASSIGNMENT",
        message: "Teacher is not assigned to this student",
        status: 400,
      });
    }

    // Check if attendance already exists for this date and subject
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        teacher_id: Number(teacherId),
        student_id: Number(studentId),
        date: dateObj,
        subject: subject || null,
      },
    });

    if (existingAttendance) {
      return respondWithError({
        error: "ATTENDANCE_ALREADY_EXISTS",
        message: "Attendance has already been marked for this date and subject",
        status: 400,
      });
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        teacher_id: Number(teacherId),
        student_id: Number(studentId),
        date: dateObj,
        status,
        subject: subject || null,
        session_duration: sessionDuration ? Number(sessionDuration) : null,
        notes: notes || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        marked_by: Number(teacherId),
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    return respondWithSuccess({
      data: {
        id: attendance.id,
        studentId: attendance.student_id,
        studentName: `${attendance.student.user.first_name} ${attendance.student.user.last_name}`.trim(),
        date: attendance.date,
        status: attendance.status,
        subject: attendance.subject,
        sessionDuration: attendance.session_duration,
        notes: attendance.notes,
        latitude: attendance.latitude,
        longitude: attendance.longitude,
        markedAt: attendance.marked_at,
      },
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("POST /teacher/attendance error", error);
    return respondWithError({
      error: "ATTENDANCE_MARK_FAILED",
      message: "Unable to mark attendance",
      status: 500,
    });
  }
}