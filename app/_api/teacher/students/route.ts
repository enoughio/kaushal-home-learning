import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/_api/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      });
    }

    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
    });

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      });
    }

    const students = await prisma.students.findMany({
      where: { assigned_teacher_id: teacher.id },
      include: {
        user: true,
      },
    });

    const formattedStudents = students.map((student) => ({
      id: student.id.toString(),
      name: `${student.user.first_name || ""} ${student.user.last_name || ""}`.trim(),
      email: student.user.email,
      profileImg: student.user.profile_image_url || "https://example.com/photo.jpg",
      phone: student.user.phone || "",
      parentName: student.parent_name || "",
      mapLocation: student.user.home_latitude && student.user.home_longitude 
        ? `https://maps.google.com/?q=${student.user.home_latitude},${student.user.home_longitude}`
        : "https://maps.google.com",
      location: student.user.location || "",
      pincode: student.user.pincode || "",
      status: student.is_active ? "active" : "inactive",
      enrolledAt: student.enrollment_date.toISOString(),
    }));

    return respondWithSuccess({
      data: {
        students: formattedStudents,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher students",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
