import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { authenticateAndValidateAdmin } from "@/app/api/_lib/verify";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";




export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAndValidateAdmin(req);
    if ("error" in authResult) return authResult.error;

    // Fetch teachers with relevant fields
    const teachers = await prisma.teachers.findMany({
      where: { is_active: true }, // Only active teachers
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            location : true
          },
        },
      },
      orderBy: { id: "asc" }, // Optional: Sort by ID
    });

    // Map to response format
    const responseTeachers = teachers.map((teacher) => ({
      id: teacher.id,
      firstName: teacher.user.first_name,
      lastName: teacher.user.last_name,
      email: teacher.user.email,
      location : teacher.user.location,
      qualification: teacher.qualification,
      subjectsTaught: teacher.subjects_taught,
      currentStudents: teacher.current_students,
      maxStudents: teacher.max_students,
    }));

    return respondWithSuccess({
      data: {
        message: "Teachers fetched successfully",
        teachers: responseTeachers,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teachers",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}