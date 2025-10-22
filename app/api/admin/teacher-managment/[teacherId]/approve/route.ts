import { NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

type ApprovePayload = {
  approvedBy?: number;
  monthlySalary?: number;
  salaryPayDay?: number;
  subjectsTaught?: string[];
  teachingMode?: string;
  maxStudents?: number;
  availabilitySchedule?: unknown;
};

export async function POST(_req: NextRequest, { params }: { params: { teacherId: string } }) {
  const tempTeacherId = Number(params.teacherId);

  if (!Number.isInteger(tempTeacherId) || tempTeacherId <= 0) {
    return respondWithError({
      error: "INVALID_TEACHER_ID",
      message: "Teacher id must be a positive integer",
      status: 400,
    });
  }

  let payload: ApprovePayload = {};
  try {
    payload = (await _req.json()) as ApprovePayload;
  } catch (error) {
    if (_req.headers.get("content-length")) {
      return respondWithError({
        error: "INVALID_JSON",
        message: "Request body must be valid JSON",
        status: 400,
      });
    }
  }

  try {
    const adminUser = requireRole(_req, "admin");

    const application = await prisma.temp_teachers.findUnique({
      where: { id: tempTeacherId },
      include: { temp_user: true },
    });

    if (!application || !application.temp_user) {
      return respondWithError({
        error: "TEACHER_APPLICATION_NOT_FOUND",
        message: "The requested teacher application does not exist",
        status: 404,
      });
    }

    const approvedBy = payload.approvedBy ?? adminUser.id;

    const result = await prisma.$transaction(async (tx) => {
      const { temp_user: user } = application;

      const availabilityScheduleOverride =
        payload.availabilitySchedule as Prisma.InputJsonValue | undefined;

      const createdUser = await tx.users.create({
        data: {
          email: user.email,
          role: "teacher",
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          house_number: user.house_number,
          street: user.street,
          city: user.city,
          pincode: user.pincode,
          date_of_birth: user.date_of_birth,
          home_latitude: null,
          home_longitude: null,
          is_verified: true,
          is_active: true,
        },
      });

      const createdTeacher = await tx.teachers.create({
        data: {
          user_id: createdUser.id,
          qualification: application.qualification,
          experience_years: application.experience_years,
          subjects_taught: payload.subjectsTaught ?? application.subjects_taught,
          teaching_mode: payload.teachingMode ?? application.teaching_mode,
          monthly_salary: payload.monthlySalary ?? application.monthly_salary,
          salary_pay_day: payload.salaryPayDay ?? 1,
          bank_account_number: application.bank_account_number,
          bank_ifsc_code: application.bank_ifsc_code,
          bank_name: application.bank_name,
          account_holder_name: application.account_holder_name,
          aadhar_url: application.aadhar_url,
          aadhar_url_public_id: application.aadhar_url_public_id,
          resume_url: application.resume_url,
          resume_url_public_id: application.resume_url_public_id,
          certificates_url: application.certificates_url,
          certificates_url_public_id: application.certificates_url_public_ids?.join(",") ?? null,
          tenth_percentage: application.tenth_percentage,
          twelfth_percentage: application.twelfth_percentage,
          marksheet_url_tenth: application.marksheet_url_tenth,
          marksheet_url_tenth_public_id: application.marksheet_url_tenth_public_id,
          marksheet_url_twelfth: application.marksheet_url_twelfth,
          marksheet_url_twelfth_public_id: application.marksheet_url_twelfth_public_id,
          availability_schedule:
            availabilityScheduleOverride ??
            (application.availability_schedule as Prisma.InputJsonValue | undefined),
          max_students: payload.maxStudents ?? application.max_students,
          approval_status: "approved",
          approved_by: approvedBy,
          approved_at: new Date(),
          is_active: true,
        },
        include: { user: true },
      });

      await tx.temp_teachers.delete({ where: { id: application.id } });
      await tx.temp_users.delete({ where: { id: application.temp_user_id } });

      return { createdUser, createdTeacher };
    });

    return respondWithSuccess({
      data: {
        teacher: {
          id: result.createdTeacher.id,
          userId: result.createdUser.id,
          email: result.createdUser.email,
          firstName: result.createdUser.first_name,
          lastName: result.createdUser.last_name,
          phone: result.createdUser.phone,
          qualification: result.createdTeacher.qualification,
          subjectsTaught: result.createdTeacher.subjects_taught,
          teachingMode: result.createdTeacher.teaching_mode,
          monthlySalary: result.createdTeacher.monthly_salary,
          salaryPayDay: result.createdTeacher.salary_pay_day,
          maxStudents: result.createdTeacher.max_students,
          approvedAt: result.createdTeacher.approved_at,
        },
      },
      message: "Teacher approved successfully",
      status: 200,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("POST /admin/teacher-managment/:teacherId/approve error", error);
    return respondWithError({
      error: "TEACHER_APPROVAL_FAILED",
      message: "Unable to approve teacher",
      status: 500,
    });
  }
}
