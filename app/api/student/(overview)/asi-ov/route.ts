import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/app/api/_lib/auth";


// get pending assignments for a student
export async function GET(req: NextRequest) {
    try {

        const user = getAuthUser(req);
        if (!user || user.role !== "student") {
            return respondWithError({
                error: "FORBIDDEN",
                message: "Only students can access this endpoint",
                status: 403,
            });
        }

        const student = await prisma.students.findFirst({
            where: { user_id: user.id },
        });

        if (!student) {
            return respondWithError({
                error: "NOT_FOUND",
                message: "Student profile not found",
                status: 404,
            });
        }


        const pendingAssignments = await prisma.assignments.findMany({
            where: {
                student_id: student.id,
                status: "ASSIGNED",
            },
            select : {
                id : true,
                title : true,
                subject : true,
                due_date : true,
                status : true
            }
        });

        const pendingAssignmentsData = pendingAssignments.map(assignment => ({
            id: assignment.id.toString(),
            title: assignment.title,
            subject: assignment.subject,
            dueDate: assignment.due_date ? assignment.due_date.toISOString() : null,
            status: assignment.status,
        }));

        return respondWithSuccess({
            data: pendingAssignmentsData,
            message: "Pending assignments fetched successfully",
            status: 200,
        });

    } catch (error) {

        console.error("Error fetching pending assignments:", error);
        return respondWithError({
            error: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
            status: 500,
        });

    }
}