import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

// Define the expected response shape for type safety
interface TeacherManagementResponse {
  pendingTeachers: {
    id: string;
    name: string;
    email: string;
    aadharNumber: string;
    phone: string;
    location: string;
    pincode: string;
    Subjects: string[];
    highestQualification: string;
    "10thPercentage": number;
    "12thPercentage": number;
    applyedAt: string;
    marksheetUrl10: string;
    marksheetUrl12: string;
    resume: string;
  }[];
  page: number;
  totalPages: number;
  totalTeachers: number;
}

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20"); // Default to 20 as per /admin/users-managment
    const skip = (page - 1) * limit;

    // Fetch email-verified users with related temp_teachers data
    const pendingTeachers = await prisma.temp_users.findMany({
      where: {
        verified: true, // Email-verified users
        temp_teachers: {
          some: {}, // Ensure user has at least one temp_teachers record (pending by definition)
        },
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        house_number: true,
        street: true,
        city: true,
        pincode: true,
        temp_teachers: {
          select: {
            id: true,
            qualification: true,
            subjects_taught: true,
            tenth_percentage: true,
            twelfth_percentage: true,
            created_at: true,
            marksheet_url_tenth: true,
            marksheet_url_twelfth: true,
            resume_url: true,
            aadhar_url: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
      take: limit,
      skip,
    });

    // Count total pending teachers
    const totalTeachers = await prisma.temp_users.count({
      where: {
        verified: true,
        temp_teachers: {
          some: {}, // Count users with temp_teachers records
        },
      },
    });

    // Format the response to match API documentation
    const formattedTeachers: TeacherManagementResponse["pendingTeachers"] =
      pendingTeachers
        .filter((user) => user.temp_teachers.length > 0) // Ensure user has a temp_teachers record
        .map((user) => {
          const teacher = user.temp_teachers[0]; // Take the first temp_teachers record
          const locationParts = [user.house_number, user.street, user.city].filter(
            Boolean
          );
          const location =
            locationParts.length > 0 ? locationParts.join(", ") : "N/A";

          return {
            id: teacher.id.toString(), // Use temp_teachers.id
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown",
            email: user.email,
            aadharNumber: teacher.aadhar_url?.split("/").pop() || "N/A", // Derive from aadhar_url
            phone: user.phone || "N/A",
            location,
            pincode: user.pincode || "N/A",
            Subjects: teacher.subjects_taught || [],
            highestQualification: teacher.qualification || "N/A",
            "10thPercentage": teacher.tenth_percentage || 0,
            "12thPercentage": teacher.twelfth_percentage || 0,
            applyedAt: teacher.created_at.toISOString(),
            marksheetUrl10: teacher.marksheet_url_tenth || "N/A",
            marksheetUrl12: teacher.marksheet_url_twelfth || "N/A",
            resume: teacher.resume_url || "N/A",
          };
        });

    return respondWithSuccess({
      data: {
        pendingTeachers: formattedTeachers,
        page,
        totalPages: Math.ceil(totalTeachers / limit),
        totalTeachers,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching teacher management data:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher management data",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}