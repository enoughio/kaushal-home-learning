import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid user ID",
        status: 400,
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        students: true,
        teachers: true,
      },
    });

    if (!user) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "User not found",
        status: 404,
      });
    }

    const baseResponse = {
      id: user.id.toString(),
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
      role: user.role,
      status: user.is_active ? "active" : "inactive",
      joinedAt: user.created_at.toISOString(),
      profile: {
        aadharNumber: "1234-5678-9012",
        photoUrl: user.profile_image_url || "https://example.com/photo.jpg",
        phone: user.phone || "",
        location: user.location || "",
        pincode: user.pincode || "",
        additionalInfo: "",
      },
    };

    // Add teacher-specific fields if user is a teacher
    if (user.role === "teacher" && user.teachers.length > 0) {
      const teacher = user.teachers[0];
      return respondWithSuccess({
        data: {
          ...baseResponse,
          subjects: teacher.subjects_taught || [],
          highestQualification: teacher.qualification || "",
          "10thPercentage": teacher.tenth_percentage || 0,
          "12thPercentage": teacher.twelfth_percentage || 0,
          isVarified: teacher.approval_status === "approved",
          marksheetUrl10: teacher.marksheet_url_tenth || "",
          marksheetUrl12: teacher.marksheet_url_twelfth || "",
          resume: teacher.resume_url || "",
        },
        status: 200,
      });
    }

    return respondWithSuccess({
      data: baseResponse,
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch user details",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid user ID",
        status: 400,
      });
    }

    const body = await req.json();
    const { name, email, status, phone, location, pincode, additionalInfo } =
      body;

    // Parse name into first and last name
    const nameParts = (name || "").split(" ");
    const first_name = nameParts[0] || null;
    const last_name = nameParts.slice(1).join(" ") || null;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "User not found",
        status: 404,
      });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        email: email || user.email,
        is_active: status === "active" ? true : false,
        phone: phone || user.phone,
        location: location || user.location,
        pincode: pincode || user.pincode,
      },
    });

    return respondWithSuccess({
      data: {
        message: "User updated successfully",
        userId: user.id.toString(),
        updatedFields: {
          name: `${updatedUser.first_name || ""} ${updatedUser.last_name || ""}`.trim(),
          email: updatedUser.email,
          status: updatedUser.is_active ? "active" : "inactive",
          phone: updatedUser.phone,
          location: updatedUser.location,
          pincode: updatedUser.pincode,
          additionalInfo,
        },
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to update user",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid user ID",
        status: 400,
      });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "User not found",
        status: 404,
      });
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    return respondWithSuccess({
      data: {
        message: "User deleted successfully",
        userId: user.id.toString(),
      },
      status: 200,
    });
  } catch (error) {
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete user",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    });
  }
}
