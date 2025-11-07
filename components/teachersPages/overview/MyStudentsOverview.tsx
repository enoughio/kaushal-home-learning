import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import Link from "next/link"
import myFetch from "@/lib/requestHelper"
import { AlertTriangle, Users } from "lucide-react"

interface StudentData {
  id: number
  user: {
    id: number
    first_name: string | null
    last_name: string | null
    email: string
    gender: string | null
  }
}

interface MyStudentsResponse {
  students: StudentData[]
}

/**
 * Fetch teacher's students from API
 */
async function fetchMyStudents(): Promise<StudentData[]> {
  try {
    const response = await myFetch("/api/teacher/my-students")

    if (!response.ok) {
      console.error("Failed to fetch my students:", response.status)
      return []
    }

    const data = await response.json()
    return data?.data?.students || []
  } catch (error) {
    console.error("Error fetching my students:", error)
    return []
  }
}

/**
 * Get full name from user object
 */
function getFullName(user: StudentData["user"]): string {
  const firstName = user.first_name || ""
  const lastName = user.last_name || ""
  return `${firstName} ${lastName}`.trim() || user.email
}

const MyStudentsOverview = async () => {
  const students = await fetchMyStudents()

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Students
          </CardTitle>
          <Link
            href="/teacher/students"
            className="px-2 py-1 text-sm rounded hover:underline text-muted-foreground hover:text-foreground transition-colors"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No students assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 3).map((student) => (
                <Link
                  key={student.id}
                  href={`/teacher/students/${student.id}`}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{getFullName(student.user)}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.user.email}
                    </p>
                    {student.user.gender && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {student.user.gender}
                      </p>
                    )}
                  </div>
                  <span className="ml-2 px-2 py-1 text-xs rounded bg-green-100 text-green-800 whitespace-nowrap">
                    Active
                  </span>
                </Link>
              ))}
              {students.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    and {students.length - 3} more
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MyStudentsOverview
