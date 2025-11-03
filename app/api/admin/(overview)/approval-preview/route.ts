import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

// Define the expected response shape for type safety
interface ApprovalPreviewResponse {
  pendingTeachers: {
    id: string;
    name: string;
    email: string;
    appliedAt: string;
    subjects: string[];
  }[];
}

export async function GET() {
  try {
    // Fetch pending teachers (verified: false) from temp_teachers with related temp_users data
    const pendingTeachers = await prisma.temp_teachers.findMany({
      where: {
        temp_user: {
          is_verified: true, // Filter for pending (unverified) teachers
        },
      },
      take: 5, // Limit to 5 for preview, as per your current code
      include: {
        temp_user: true, // Include related temp_users data
      },
      orderBy: {
        created_at: "asc", // Order by creation date
      },
    });

    // Format the response to match API documentation
    const formattedTeachers: ApprovalPreviewResponse["pendingTeachers"] =
      pendingTeachers.map((teacher) => ({
        id: teacher.id.toString(),
        name: `${teacher.temp_user.first_name || ""} ${
          teacher.temp_user.last_name || ""
        }`.trim() || "Unknown", // Handle nullable fields
        email: teacher.temp_user.email,
        appliedAt: teacher.created_at.toISOString(),
        subjects: teacher.subjects_taught || [], // Ensure subjects is always an array
      }));

    return respondWithSuccess({
      data: {
        pendingTeachers: formattedTeachers,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching approval preview:", error); // Log for debugging
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch approval preview",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}