import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { sendRejectionEmail } from "@/helper/mail/emailHelpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    
    const id =  (await params).teacherId;
    const teacherId = parseInt(id);

    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    // Find the teacher with necessary user data
    const teacher = await prisma.temp_teachers.findUnique({
      where: { id: teacherId },
      include: {
        temp_user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!teacher || !teacher.temp_user) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher or associated user not found",
        status: 404,
      });
    }

    // Send rejection email 
    try {
      await sendRejectionEmail(teacher.temp_user.email, {
        name: `${teacher.temp_user.first_name || ""} ${teacher.temp_user.last_name || ""}`.trim() || "Teacher",
        rejectionDate: new Date().toLocaleDateString(),
      });
    } catch (emailError) {
      console.warn("Failed to send rejection email:", emailError);
      // Continue with deletion even if email fails
      return respondWithError({
        error: "EMAIL_SENDING_FAILED",
        message: "Failed to send rejection email to the teacher",
        status: 500
      });
    }

    // Delete temp_teachers and temp_users records in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.temp_teachers.delete({
        where: { id: teacherId },
      });
      await tx.temp_users.delete({
        where: { id: teacher.temp_user_id },
      });
    });

    return respondWithSuccess({
      data: {
        message: "Teacher rejected successfully",
        teacherId: teacher.id.toString(),
        teacherName: `${teacher.temp_user.first_name || ""} ${teacher.temp_user.last_name || ""}`.trim() || "Unknown",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error rejecting teacher:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to reject teacher",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}