import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20; // Fixed limit as per API spec

    const skip = (page - 1) * limit;

    const [students, totalStudents] = await Promise.all([
      prisma.students.findMany({
        where: {
          assigned_teacher_id: null,
        },
        skip,
        take: limit,
        include: {
          user: true,
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.students.count({
        where: {
          assigned_teacher_id: null,
        },
      }),
    ]);

    const formattedStudents = students.map((student) => ({
      id: student.id.toString(),
      name: `${student.user.first_name || ""} ${student.user.last_name || ""}`.trim(),
      email: student.user.email,
      parentPhone: student.parent_phone || "",
      location: student.user.location || "",
      longitude: student.user.home_longitude?.toString() || "77.2090",
      latitude: student.user.home_latitude?.toString() || "28.6139",
      pincode: student.user.pincode || "",
      status: student.is_active ? "active" : "inactive",
      enrolledAt: student.enrollment_date.toISOString(),
    }));

    const totalPages = Math.ceil(totalStudents / limit);

    return respondWithSuccess({
      data: {
        students: formattedStudents,
        page,
        totalPages,
        totalStudents,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch unassigned students",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
