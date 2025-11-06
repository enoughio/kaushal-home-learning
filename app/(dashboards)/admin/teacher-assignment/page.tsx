import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import AssignmentForm from "@/components/adminPages/pairing/AssignmentForm"
import StudentsWithoutTeachers from "@/components/adminPages/pairing/StudentsWithoutTeachers"
import AssignedPairs from "@/components/adminPages/pairing/AssignedPairs"
import { myFetch } from "@/lib/requestHelper"

interface Student {
  id: string
  name: string
  email: string
  parentPhone: string
  location: string
  pincode: string
  status: string
  enrolledAt: string
}

interface Teacher {
  id: number
  firstName: string
  lastName: string
  email: string
  location: string
  qualification: string
  subjectsTaught: string[]
  currentStudents: number
  maxStudents: number
}

interface StudentResponse {
  students: Student[]
  page: number
  totalPages: number
  totalStudents: number
}

interface TeacherResponse {
  message: string
  teachers: Teacher[]
}

interface Pair {
  id: number
  pairId: number
  studentId: string
  teacherId: string
  studentName: string
  teacherName: string
  studentEmail: string
  teacherEmail: string
  studentLocation: string
  teacherLocation: string
  assignedAt: string
}

interface PairsResponse {
  pairs: Pair[]
  page: number
  totalPages: number
  totalPairs: number
}

async function getUnassignedStudents(): Promise<Student[]> {
  try {
    const response = await myFetch("/api/admin/assign-teacher?page=1", {
      method: "GET",
    })

    if (!response.ok) {
      console.error("Failed to fetch students:", response.status)
      return []
    }

    const data: { data: StudentResponse } = await response.json()
    return data.data?.students || []
  } catch (error) {
    console.error("Error fetching unassigned students:", error)
    return []
  }
}

async function getAvailableTeachers(): Promise<Teacher[]> {
  try {
    const response = await myFetch("/api/admin/users/teacher", {
      method: "GET",
    })

    if (!response.ok) {
      console.error("Failed to fetch teachers:", response.status)
      return []
    }

    const data: { data: TeacherResponse } = await response.json()
    return data.data?.teachers || []
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return []
  }
}

async function getAssignedPairs(): Promise<{ pairs: Pair[]; totalPairs: number }> {
  try {
    const response = await myFetch("/api/admin/assign-teacher/all?page=1", {
      method: "GET",
    })

    if (!response.ok) {
      console.error("Failed to fetch pairs:", response.status)
      return { pairs: [], totalPairs: 0 }
    }

    const data: { data: PairsResponse } = await response.json()
    return {
      pairs: data.data?.pairs || [],
      totalPairs: data.data?.totalPairs || 0,
    }
  } catch (error) {
    console.error("Error fetching assigned pairs:", error)
    return { pairs: [], totalPairs: 0 }
  }
}

export default async function TeacherAssignmentsPage() {
  // Fetch data in parallel
  const [students, teachers, { pairs, totalPairs }] = await Promise.all([
    getUnassignedStudents(),
    getAvailableTeachers(),
    getAssignedPairs(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Assignments</h1>
        <p className="text-muted-foreground">Manage teacher-student assignments</p>
      </div>

      {/* Assignment Form */}
      <AssignmentForm students={students} teachers={teachers} />

      {/* Students Without Teachers List */}
      <StudentsWithoutTeachers students={students} loading={false} />

      {/* Assigned Pairs List */}
      <AssignedPairs pairs={pairs} teachers={teachers} totalPairs={totalPairs} loading={false} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Students Without Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Assigned Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPairs}</div>
            <p className="text-xs text-muted-foreground mt-1">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to assign</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Teachers at Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {teachers.filter((t) => t.currentStudents >= t.maxStudents).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cannot accept new</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      {teachers.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">No Teachers Available</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              There are no active teachers available to assign. Please wait for teachers to be approved or contact an administrator.
            </p>
          </CardContent>
        </Card>
      )}

      {students.length === 0 && totalPairs > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-800">All Students Assigned</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              Great! All students have been successfully assigned to teachers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
