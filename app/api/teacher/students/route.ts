import { NextRequest } from "next/server"
import { respondWithError, respondWithSuccess } from "@/app/api/_lib/http"
import { prisma } from "@/lib/db"
import { getAuthUser } from "@/app/api/_lib/auth"

// get all the students for a teacher
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user || user.role !== "teacher") {
      return respondWithError({
        error: "FORBIDDEN",
        message: "Only teachers can access this endpoint",
        status: 403,
      })
    }

    const teacher = await prisma.teachers.findFirst({
      where: { user_id: user.id },
      select: { id: true },
    })

    if (!teacher) {
      return respondWithError({
        error: "NOT_FOUND",
        message: "Teacher profile not found",
        status: 404,
      })
    }

    const students = await prisma.students.findMany({
      where: { assigned_teacher_id: teacher.id },
      select: {
        id: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            gender: true,
            city: true,
          },
        },
        grade: true,
        school_name: true,
        enrollment_date: true,
        parent_name: true,
        parent_phone: true,
        parent_email: true,
        is_active: true,
        subjects_interested: true,
      },
      orderBy: {
        enrollment_date: "desc",
      },
    })

    const transformedStudents = students.map((student) => ({
      id: student.id,
      name: `${student.user.first_name || ""} ${student.user.last_name || ""}`.trim() || student.user.email,
      age: null, // Age not available in database
      status: student.is_active ? "active" : "inactive",
      phone: student.user.phone || "",
      location: student.user.city || "",
      joinedDate: student.enrollment_date ? new Date(student.enrollment_date).toISOString().split("T")[0] : "",
      parentName: student.parent_name || "",
      parentPhone: student.parent_phone || "",
      parentEmail: student.parent_email || "",
      skillsLearning: student.subjects_interested || [],
      grade: student.grade || "",
      schoolName: student.school_name || "",
    }))

    return respondWithSuccess({
      data: {
        students: transformedStudents,
      },
      status: 200,
    })
  } catch (error) {
    console.error("Error fetching teacher students:", error)
    return respondWithError({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch teacher students",
      status: 500,
      details: error instanceof Error ? error.message : undefined,
    })
  }
}
