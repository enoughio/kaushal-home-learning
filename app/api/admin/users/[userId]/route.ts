import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { jwtVerify } from 'jose'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {

    const id  = (await params).userId;
    const userId = parseInt(id);

    

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
        // photoUrl: user.profile_image_url || "",
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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {

    const param = await params
    const userId =  parseInt(param.userId); 

    if (isNaN(userId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid user ID",
        status: 400,
      });
    }


        // Verify JWT and check admin role
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return respondWithError({
        error: "UNAUTHENTICATED",
        message: "Authentication required",
        status: 401,
      });
    }

    let payload;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch {
      return respondWithError({
        error: "UNAUTHENTICATED",
        message: "Invalid or expired token",
        status: 401,
      });
    }

    if (payload.role !== "admin") {
      return respondWithError({
        error: "UNAUTHORIZED",
        message: "Admin access required",
        status: 403,
      });
    }

    const body = await req.json();
    const { firstName, lastName, email, status, phone, location, pincode, additionalInfo } =
      body;

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
        first_name: firstName || user.first_name,
        last_name: lastName || user.last_name,
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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {

    const param = await params
    const userId =  parseInt(param.userId); 

    if (isNaN(userId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid user ID",
        status: 400,
      });
    }

    // Verify JWT and check admin role
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return respondWithError({
        error: "UNAUTHENTICATED",
        message: "Authentication required",
        status: 401,
      });
    }

    let payload;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch {
      return respondWithError({
        error: "UNAUTHENTICATED",
        message: "Invalid or expired token",
        status: 401,
      });
    }

    if (payload.role !== "admin") {
      return respondWithError({
        error: "UNAUTHORIZED",
        message: "Admin access required",
        status: 403,
      });
    }

    // Find the user with name fields for response
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });

    if (!user) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "User not found",
        status: 404,
      });
    }

    // Delete user and related teachers records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related teachers records first due to foreign key constraint
      await tx.teachers.deleteMany({
        where: { user_id: userId },
      });

      await tx.students.deleteMany({
        where: { user_id: userId },
      });
      // Delete the user
      await tx.users.delete({
        where: { id: userId },
      });
    });


    return respondWithSuccess({
      data: {
        message: "User deleted successfully",
        userId: user.id.toString(),
        userName: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete user",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}