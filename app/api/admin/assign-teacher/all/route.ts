// Get all teacher-student pairs in the application

import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const skip = (page - 1) * limit;

    // Fetch pairs with full details
    const pairs = await prisma.teacher_student_assignments.findMany({
      skip,
      take: limit,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                location: true,
              },
            },
          },
        },
        student: {
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: { assigned_date: "desc" },
    });

    // Get total count
    const totalPairs = await prisma.teacher_student_assignments.count();

    type Pair = {
      id: number;
      student_id: number;
      teacher_id: number;
      assigned_date: Date | null;
      student: {
        user: {
          first_name: string | null;
          last_name: string | null;
          email: string;
          location: string | null;
        };

      };
      teacher: {
        user: {
          first_name: string | null;
          last_name: string | null;
          email: string;
          location: string | null;
        };
      };
    };

    const formattedPairs = pairs.map((pair: Pair) => ({
      id: pair.id,
      pairId: pair.id,
      studentId: pair.student_id.toString(),
      teacherId: pair.teacher_id.toString(),
      studentName: `${pair.student.user.first_name || ""} ${pair.student.user.last_name || ""}`.trim(),
      teacherName: `${pair.teacher.user.first_name || ""} ${pair.teacher.user.last_name || ""}`.trim(),
      studentEmail: pair.student.user.email,
      teacherEmail: pair.teacher.user.email,
      studentLocation: pair.student.user.location || "N/A",
      teacherLocation: pair.teacher.user.location || "N/A",
      assignedAt: pair.assigned_date?.toISOString() || new Date().toISOString(),
    }));


    const totalPages = Math.ceil(totalPairs / limit);

    return respondWithSuccess({
      data: {
        pairs: formattedPairs,
        page,
        totalPages,
        totalPairs,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching pairs:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher-student pairs",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}