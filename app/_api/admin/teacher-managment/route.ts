import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/_api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const pendingTeachers = await prisma.teachers.findMany({
      where: {
        approval_status: "pending",
      },
      include: {
        user: true,
      },
      orderBy: { created_at: "asc" },
    });

    const formattedTeachers = await Promise.all(
      pendingTeachers.map(async (teacher) => {
        return {
          id: teacher.id.toString(),
          name: `${teacher.user.first_name || ""} ${teacher.user.last_name || ""}`.trim(),
          email: teacher.user.email,
          aadharNumber: "1234-5678-9012", // This would come from the actual data
          phone: teacher.user.phone || "",
          location: teacher.user.location || "",
          pincode: teacher.user.pincode || "",
          Subjects: teacher.subjects_taught || [],
          highestQualification: teacher.qualification || "",
          "10thPercentage": teacher.tenth_percentage || 0,
          "12thPercentage": teacher.twelfth_percentage || 0,
          applyedAt: teacher.created_at.toISOString(),
          marksheetUrl10: teacher.marksheet_url_tenth || "",
          marksheetUrl12: teacher.marksheet_url_twelfth || "",
          resume: teacher.resume_url || "",
        };
      })
    );

    return respondWithSuccess({
      data: {
        pendingTeachers: formattedTeachers,
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher management data",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
