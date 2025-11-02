import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { sendApprovalEmail } from "@/helper/mail/emailHelpers";
import { UserRole } from "@/generated/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    
    let id =  (await params).teacherId;
    let teacherId = parseInt(id);

    if (isNaN(teacherId)) {
      return respondWithError({
        error: "INVALID_REQUEST",
        message: "Invalid teacher ID",
        status: 400,
      });
    }

    // Find the temp teacher with related temp_user
    const tempTeacher = await prisma.temp_teachers.findUnique({
      where: { id: teacherId },
      include: { temp_user: true },
    });

    if (!tempTeacher || !tempTeacher.temp_user) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher or associated user not found",
        status: 404,
      });
    }

    // send an email to the teacher about approval
    try {
      await sendApprovalEmail(tempTeacher.temp_user.email, {
        name: `${tempTeacher.temp_user.first_name || ""} ${tempTeacher.temp_user.last_name || ""}`.trim() || "Teacher",
        approvalDate: new Date().toLocaleDateString(),});
    } catch (error) {
      return respondWithError({
        error: "EMAIL_SENDING_FAILED",
        message: "Failed to send approval email to the teacher",
        status: 500
      });
    }

    // Use a transaction to create user and teacher records, then delete temp records
    const { newUser, newTeacher } = await prisma.$transaction(async (tx) => {
      // Create new user record
      const newUser = await tx.users.create({
        data: {
          email: tempTeacher.temp_user.email,
          first_name: tempTeacher.temp_user.first_name,
          last_name: tempTeacher.temp_user.last_name,
          phone: tempTeacher.temp_user.phone,
          house_number: tempTeacher.temp_user.house_number,
          street: tempTeacher.temp_user.street,
          city: tempTeacher.temp_user.city,
          pincode: tempTeacher.temp_user.pincode,
          role: UserRole.teacher, 
          is_active: true,
          is_verified: true,
          home_latitude: 22.233,
          home_longitude: 78.546,
          date_of_birth: tempTeacher.temp_user.date_of_birth,
          gender: tempTeacher.temp_user.gender,
          created_at: tempTeacher.temp_user.created_at,
        },
      });

      // Create new teacher record
      const newTeacher = await tx.teachers.create({
        data: {
          user_id: newUser.id,
          qualification: tempTeacher.qualification,
          subjects_taught: tempTeacher.subjects_taught,
          tenth_percentage: tempTeacher.tenth_percentage,
          twelfth_percentage: tempTeacher.twelfth_percentage,
          marksheet_url_tenth: tempTeacher.marksheet_url_tenth,
          marksheet_url_twelfth: tempTeacher.marksheet_url_twelfth,
          resume_url: tempTeacher.resume_url,
          aadhar_url: tempTeacher.aadhar_url,
          created_at: tempTeacher.created_at,
        },
      });

      // Delete temp_teachers and temp_users records
      await tx.temp_teachers.delete({
        where: { id: teacherId },
      });

      await tx.temp_users.delete({
        where: { id: tempTeacher.temp_user_id },
      });

      return { newUser, newTeacher };
    });




    return respondWithSuccess({
      data: {
        message: "Teacher approved successfully",
        teacherId: newTeacher.id.toString(),
        teacherName: `${newUser.first_name || ""} ${newUser.last_name || ""}`.trim() || "Unknown",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error approving teacher:", error);
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to approve teacher",
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}