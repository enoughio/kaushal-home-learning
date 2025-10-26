import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { parsePagination } from "@/app/api/_lib/pagination";

export async function GET(req: NextRequest) {


  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams, { limit: 20 });

  try {
    const where = {
      role: "teacher" as const,
    };

    const [total, results] = await Promise.all([
      prisma.temp_users.count({ where }),
      prisma.temp_users.findMany({
        where,
        include: {
          temp_teachers: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    // const pendingTeachers = results.map((user) => {
    //   return user.temp_teachers[0];

    //   // return {
    //   //   tempUserId: user.id,
    //   //   email: user.email,
    //   //   firstName: user.first_name,
    //   //   lastName: user.last_name,
    //   //   phone: user.phone,
    //   //   city: user.city,
    //   //   createdAt: user.created_at,
    //   //   qualification: profile?.qualification ?? null,
    //   //   experienceYears: profile?.experience_years ?? null,
    //   //   subjectsTaught: profile?.subjects_taught ?? [],
    //   //   teachingMode: profile?.teaching_mode ?? null,
    //   //   expectedMonthlySalary: profile?.monthly_salary ?? null,
    //   //   availabilitySchedule: profile?.availability_schedule ?? null,
    //   // };
    // });

    return respondWithSuccess({
      data: {
        pendingTeachers : results,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error("GET /admin/teacher-managment error", error);
    return respondWithError({
      error: "TEACHER_FETCH_FAILED",
      message: "Unable to fetch pending teachers",
      status: 500,
    });
  }
}
