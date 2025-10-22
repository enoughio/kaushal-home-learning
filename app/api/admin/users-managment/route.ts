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

  const role = searchParams.get("role");
  const status = searchParams.get("status");

  const where: any = {};
  if (role && ["student", "teacher"].includes(role)) {
    where.role = role;
  }
  if (status && ["active", "inactive"].includes(status)) {
    where.is_active = status === "active";
  }

  try {
    const [total, users] = await Promise.all([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        include: {
          students: true,
          teachers: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const userList = users.map((user) => {
      const studentProfile = user.role === "student" ? user.students[0] : null;
      const teacherProfile = user.role === "teacher" ? user.teachers[0] : null;

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        city: user.city,
        isActive: user.is_active,
        createdAt: user.created_at,
        ...(studentProfile ? {
          grade: studentProfile.grade,
          schoolName: studentProfile.school_name,
          parentName: studentProfile.parent_name,
          monthlyFee: studentProfile.monthly_fee,
        } : {}),
        ...(teacherProfile ? {
          qualification: teacherProfile.qualification,
          subjectsTaught: teacherProfile.subjects_taught,
          monthlySalary: teacherProfile.monthly_salary,
          approvalStatus: teacherProfile.approval_status,
        } : {}),
      };
    });

    return respondWithSuccess({
      data: {
        users: userList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /admin/users-managment error", error);
    return respondWithError({
      error: "USERS_FETCH_FAILED",
      message: "Unable to fetch users",
      status: 500,
    });
  }
}