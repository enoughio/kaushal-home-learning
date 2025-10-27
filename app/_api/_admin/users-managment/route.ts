import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { parsePagination } from "@/app/_api/_lib/pagination";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const token = req.cookies.get("auth-token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return respondWithError({
        error: "UNAUTHENTICATED",
        message: "Authentication required",
        status: 401,
      });
    }

    let userRole: string | null = null;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      userRole = (payload as any).role;
    } catch (error) {
      return respondWithError({
        error: "INVALID_TOKEN",
        message: "Invalid or expired token",
        status: 401,
      });
    }

    if (userRole !== "admin") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Admin access required",
        status: 403,
      });
    }

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });

    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (role && ["student", "teacher"].includes(role)) {
      where.role = role;
    }
    if (status && ["active", "inactive"].includes(status)) {
      where.is_active = status === "active";
    }
    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: "insensitive" } },
        { last_name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

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