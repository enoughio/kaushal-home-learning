import { NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { requireRole } from "@/app/api/_lib/auth";

type RejectPayload = {
  reason?: string;
  rejectedBy?: number;
};

export async function POST(req: NextRequest, { params }: { params: { teacherId: string } }) {
  const tempTeacherId = Number(params.teacherId);

  if (!Number.isInteger(tempTeacherId) || tempTeacherId <= 0) {
    return respondWithError({
      error: "INVALID_TEACHER_ID",
      message: "Teacher id must be a positive integer",
      status: 400,
    });
  }

  let payload: RejectPayload = {};
  try {
    payload = (await req.json()) as RejectPayload;
  } catch (error) {
    if (req.headers.get("content-length")) {
      return respondWithError({
        error: "INVALID_JSON",
        message: "Request body must be valid JSON",
        status: 400,
      });
    }
  }

  try {
    const adminUser = requireRole(req, "admin");

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

    const rejectedBy = payload.rejectedBy ?? adminUser.id;
    const reason = payload.reason?.trim();

    await prisma.$transaction(async (tx) => {
      await tx.temp_teachers.delete({ where: { id: application.id } });
      await tx.temp_users.delete({ where: { id: application.temp_user_id } });

      if (reason || rejectedBy) {
        await tx.audit_logs.create({
          data: {
            user_id: rejectedBy,
            action: "teacher_rejected",
            table_name: "temp_teachers",
            record_id: application.id,
            new_values: reason
              ? ({ reason } satisfies Prisma.JsonObject)
              : undefined,
          },
        });
      }
    });

    return respondWithSuccess({
      data: {
        rejected: true,
        tempTeacherId,
      },
      message: "Teacher application rejected",
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("POST /admin/teacher-managment/:teacherId/reject error", error);
    return respondWithError({
      error: "TEACHER_REJECTION_FAILED",
      message: "Unable to reject teacher",
      status: 500,
    });
  }
}
