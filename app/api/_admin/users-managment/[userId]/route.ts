import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  houseNumber?: string;
  street?: string;
  city?: string;
  pincode?: string;
  isActive?: boolean;
  // Student specific
  grade?: string;
  schoolName?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact?: string;
  subjectsInterested?: string[];
  preferredSchedule?: string;
  monthlyFee?: number;
  // Teacher specific
  qualification?: string;
  experienceYears?: number;
  subjectsTaught?: string[];
  teachingMode?: string;
  monthlySalary?: number;
  salaryPayDay?: number;
  maxStudents?: number;
};

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const userId = Number(params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return respondWithError({
      error: "INVALID_USER_ID",
      message: "User id must be a positive integer",
      status: 400,
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        students: true,
        teachers: true,
      },
    });

    if (!user) {
      return respondWithError({
        error: "USER_NOT_FOUND",
        message: "The requested user does not exist",
        status: 404,
      });
    }

    const studentProfile = user.role === "student" ? user.students[0] : null;
    const teacherProfile = user.role === "teacher" ? user.teachers[0] : null;

    const userDetails = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      houseNumber: user.house_number,
      street: user.street,
      city: user.city,
      pincode: user.pincode,
      dateOfBirth: user.date_of_birth,
      location: user.location,
      homeLatitude: user.home_latitude,
      homeLongitude: user.home_longitude,
      isVerified: user.is_verified,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      ...(studentProfile ? {
        studentId: studentProfile.id,
        grade: studentProfile.grade,
        schoolName: studentProfile.school_name,
        parentName: studentProfile.parent_name,
        parentPhone: studentProfile.parent_phone,
        parentEmail: studentProfile.parent_email,
        emergencyContact: studentProfile.emergency_contact,
        subjectsInterested: studentProfile.subjects_interested,
        preferredSchedule: studentProfile.preferred_schedule,
        monthlyFee: studentProfile.monthly_fee,
        feeDueDate: studentProfile.fee_due_date,
        aadharUrl: studentProfile.aadhar_url,
        enrollmentDate: studentProfile.enrollment_date,
      } : {}),
      ...(teacherProfile ? {
        teacherId: teacherProfile.id,
        qualification: teacherProfile.qualification,
        experienceYears: teacherProfile.experience_years,
        subjectsTaught: teacherProfile.subjects_taught,
        teachingMode: teacherProfile.teaching_mode,
        monthlySalary: teacherProfile.monthly_salary,
        salaryPayDay: teacherProfile.salary_pay_day,
        bankAccountNumber: teacherProfile.bank_account_number,
        bankIfscCode: teacherProfile.bank_ifsc_code,
        bankName: teacherProfile.bank_name,
        accountHolderName: teacherProfile.account_holder_name,
        aadharUrl: teacherProfile.aadhar_url,
        resumeUrl: teacherProfile.resume_url,
        certificatesUrl: teacherProfile.certificates_url,
        tenthPercentage: teacherProfile.tenth_percentage,
        twelfthPercentage: teacherProfile.twelfth_percentage,
        marksheetUrlTenth: teacherProfile.marksheet_url_tenth,
        marksheetUrlTwelfth: teacherProfile.marksheet_url_twelfth,
        availabilitySchedule: teacherProfile.availability_schedule,
        maxStudents: teacherProfile.max_students,
        currentStudents: teacherProfile.current_students,
        rating: teacherProfile.rating,
        totalReviews: teacherProfile.total_reviews,
        approvalStatus: teacherProfile.approval_status,
        approvedBy: teacherProfile.approved_by,
        approvedAt: teacherProfile.approved_at,
        rejectionReason: teacherProfile.rejection_reason,
      } : {}),
    };

    return respondWithSuccess({
      data: userDetails,
    });
  } catch (error) {
    console.error("GET /admin/users-managment/:userId error", error);
    return respondWithError({
      error: "USER_FETCH_FAILED",
      message: "Unable to fetch user details",
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const userId = Number(params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return respondWithError({
      error: "INVALID_USER_ID",
      message: "User id must be a positive integer",
      status: 400,
    });
  }

  let payload: UpdateUserPayload;
  try {
    payload = await req.json();
  } catch (error) {
    return respondWithError({
      error: "INVALID_JSON",
      message: "Request body must be valid JSON",
      status: 400,
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        students: true,
        teachers: true,
      },
    });

    if (!user) {
      return respondWithError({
        error: "USER_NOT_FOUND",
        message: "The requested user does not exist",
        status: 404,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update users table
      const userUpdateData: any = {};
      if (payload.firstName !== undefined) userUpdateData.first_name = payload.firstName;
      if (payload.lastName !== undefined) userUpdateData.last_name = payload.lastName;
      if (payload.phone !== undefined) userUpdateData.phone = payload.phone;
      if (payload.houseNumber !== undefined) userUpdateData.house_number = payload.houseNumber;
      if (payload.street !== undefined) userUpdateData.street = payload.street;
      if (payload.city !== undefined) userUpdateData.city = payload.city;
      if (payload.pincode !== undefined) userUpdateData.pincode = payload.pincode;
      if (payload.isActive !== undefined) userUpdateData.is_active = payload.isActive;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.users.update({
          where: { id: userId },
          data: userUpdateData,
        });
      }

      // Update profile table
      if (user.role === "student" && user.students[0]) {
        const studentUpdateData: any = {};
        if (payload.grade !== undefined) studentUpdateData.grade = payload.grade;
        if (payload.schoolName !== undefined) studentUpdateData.school_name = payload.schoolName;
        if (payload.parentName !== undefined) studentUpdateData.parent_name = payload.parentName;
        if (payload.parentPhone !== undefined) studentUpdateData.parent_phone = payload.parentPhone;
        if (payload.parentEmail !== undefined) studentUpdateData.parent_email = payload.parentEmail;
        if (payload.emergencyContact !== undefined) studentUpdateData.emergency_contact = payload.emergencyContact;
        if (payload.subjectsInterested !== undefined) studentUpdateData.subjects_interested = payload.subjectsInterested;
        if (payload.preferredSchedule !== undefined) studentUpdateData.preferred_schedule = payload.preferredSchedule;
        if (payload.monthlyFee !== undefined) studentUpdateData.monthly_fee = payload.monthlyFee;

        if (Object.keys(studentUpdateData).length > 0) {
          await tx.students.update({
            where: { id: user.students[0].id },
            data: studentUpdateData,
          });
        }
      } else if (user.role === "teacher" && user.teachers[0]) {
        const teacherUpdateData: any = {};
        if (payload.qualification !== undefined) teacherUpdateData.qualification = payload.qualification;
        if (payload.experienceYears !== undefined) teacherUpdateData.experience_years = payload.experienceYears;
        if (payload.subjectsTaught !== undefined) teacherUpdateData.subjects_taught = payload.subjectsTaught;
        if (payload.teachingMode !== undefined) teacherUpdateData.teaching_mode = payload.teachingMode;
        if (payload.monthlySalary !== undefined) teacherUpdateData.monthly_salary = payload.monthlySalary;
        if (payload.salaryPayDay !== undefined) teacherUpdateData.salary_pay_day = payload.salaryPayDay;
        if (payload.maxStudents !== undefined) teacherUpdateData.max_students = payload.maxStudents;

        if (Object.keys(teacherUpdateData).length > 0) {
          await tx.teachers.update({
            where: { id: user.teachers[0].id },
            data: teacherUpdateData,
          });
        }
      }

      // Fetch updated user
      return await tx.users.findUnique({
        where: { id: userId },
        include: {
          students: true,
          teachers: true,
        },
      });
    });

    if (!result) {
      return respondWithError({
        error: "USER_UPDATE_FAILED",
        message: "Failed to retrieve updated user",
        status: 500,
      });
    }

    const studentProfile = result.role === "student" ? result.students[0] : null;
    const teacherProfile = result.role === "teacher" ? result.teachers[0] : null;

    const updatedUserDetails = {
      id: result.id,
      email: result.email,
      role: result.role,
      firstName: result.first_name,
      lastName: result.last_name,
      phone: result.phone,
      houseNumber: result.house_number,
      street: result.street,
      city: result.city,
      pincode: result.pincode,
      isActive: result.is_active,
      updatedAt: result.updated_at,
      ...(studentProfile ? {
        grade: studentProfile.grade,
        schoolName: studentProfile.school_name,
        parentName: studentProfile.parent_name,
        parentPhone: studentProfile.parent_phone,
        parentEmail: studentProfile.parent_email,
        monthlyFee: studentProfile.monthly_fee,
      } : {}),
      ...(teacherProfile ? {
        qualification: teacherProfile.qualification,
        subjectsTaught: teacherProfile.subjects_taught,
        monthlySalary: teacherProfile.monthly_salary,
        approvalStatus: teacherProfile.approval_status,
      } : {}),
    };

    return respondWithSuccess({
      data: updatedUserDetails,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("PUT /admin/users-managment/:userId error", error);
    return respondWithError({
      error: "USER_UPDATE_FAILED",
      message: "Unable to update user",
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    requireRole(req, "admin");
  } catch (error) {
    return error as Response;
  }

  const userId = Number(params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return respondWithError({
      error: "INVALID_USER_ID",
      message: "User id must be a positive integer",
      status: 400,
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return respondWithError({
        error: "USER_NOT_FOUND",
        message: "The requested user does not exist",
        status: 404,
      });
    }

    await prisma.$transaction(async (tx) => {
      // Soft delete by setting is_deleted and deleted_at
      await tx.users.update({
        where: { id: userId },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      });

      // Log the deletion
      await tx.audit_logs.create({
        data: {
          user_id: userId,
          action: "user_deleted",
          table_name: "users",
          record_id: userId,
        },
      });
    });

    return respondWithSuccess({
      data: {
        deleted: true,
        userId,
      },
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /admin/users-managment/:userId error", error);
    return respondWithError({
      error: "USER_DELETE_FAILED",
      message: "Unable to delete user",
      status: 500,
    });
  }
}