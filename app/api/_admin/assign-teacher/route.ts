import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";
import { requireRole } from "@/app/api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });

  try {
    const [total, students] = await Promise.all([
      prisma.students.count({
        where: {
          assigned_teacher_id: null,
          is_active: true,
        },
      }),
      prisma.students.findMany({
        where: {
          assigned_teacher_id: null,
          is_active: true,
        },
        include: {
          user: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const studentList = students.map((student) => ({
      id: student.id,
      name: `${student.user.first_name} ${student.user.last_name}`.trim(),
      email: student.user.email,
      parentPhone: student.parent_phone,
      location: student.user.location,
      longitude: student.user.home_longitude,
      latitude: student.user.home_latitude,
      pincode: student.user.pincode,
      status: student.is_active ? "active" : "inactive",
      enrolledAt: student.enrollment_date,
    }));

    return respondWithSuccess({
      data: {
        students: studentList,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        totalStudents: total,
      },
    });
  } catch (error) {
    console.error("GET /admin/assign-teacher error", error);
    return respondWithError({
      error: "STUDENTS_FETCH_FAILED",
      message: "Unable to fetch students without assigned teachers",
      status: 500,
    });
  }
}