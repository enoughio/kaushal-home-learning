import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import Link from "next/link"
import myFetch from "@/lib/requestHelper"
import { AlertTriangle, FileText, Clock } from "lucide-react"

interface PendingAssignment {
  studentId: number
  title: string
  firstName: string | null
  lastName: string | null
  dueDate: Date
  status: string
}

/**
 * Fetch pending assignments for teacher
 */
async function fetchPendingReviews(): Promise<PendingAssignment[]> {
  try {
    const response = await myFetch("/api/teacher/asi-ov")

    if (!response.ok) {
      console.error("Failed to fetch pending reviews:", response.status)
      return []
    }

    const data = await response.json()
    return data?.data || []
  } catch (error) {
    console.error("Error fetching pending reviews:", error)
    return []
  }
}

/**
 * Format due date to readable format
 */
function formatDueDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return "N/A"
  }
}

/**
 * Get full name from first and last name
 */
function getFullName(firstName: string | null, lastName: string | null): string {
  const first = firstName || ""
  const last = lastName || ""
  return `${first} ${last}`.trim() || "Unknown Student"
}

const PendingReviewsOverview = async () => {
  const pendingAssignments = await fetchPendingReviews()

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending Reviews
          </CardTitle>
          <Link
            href="/teacher/assignments"
            className="px-2 py-1 text-sm rounded hover:underline text-muted-foreground hover:text-foreground transition-colors"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {pendingAssignments.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No assignments to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.slice(0, 3).map((assignment) => (
                <Link
                  key={`${assignment.studentId}-${assignment.title}`}
                  href={`/teacher/assignments/${assignment.studentId}`}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {getFullName(assignment.firstName, assignment.lastName)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      Due: {formatDueDate(assignment.dueDate as unknown as string)}
                    </div>
                  </div>
                  <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 whitespace-nowrap">
                    Review
                  </span>
                </Link>
              ))}
              {pendingAssignments.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    and {pendingAssignments.length - 3} more
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

export default PendingReviewsOverview