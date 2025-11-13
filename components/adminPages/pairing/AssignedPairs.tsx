"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LinkIcon } from "lucide-react"
import ChangePairTeacher from "./ChangePairTeacher"
import DeletePair from "./DeletePair"

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

interface AssignedPairsProps {
  pairs: Pair[]
  teachers: Teacher[]
  totalPairs: number
  loading?: boolean
}

export default function AssignedPairs({
  pairs,
  teachers,
  totalPairs,
  loading = false,
}: AssignedPairsProps) {

  const getPairDateFormatted = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMins = Math.floor(diffMs / (1000 * 60))

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
      }
      if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
      }
      if (diffMins > 0) {
        return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
      }
      return "just now"
    } catch {
      return "Unknown"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Assigned Pairs (Loading...)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading assignments...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Assigned Pairs ({totalPairs})
          </span>
          <Badge variant="default">{pairs.length} shown</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pairs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No teacher-student pairs assigned yet!
          </p>
        ) : (
          <div className="space-y-4">
            {pairs.map((pair) => (
              <div
                key={pair.pairId}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Student Info */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Student</p>
                    <div>
                      <p className="font-medium">{pair.studentName}</p>
                      <p className="text-sm text-muted-foreground">{pair.studentEmail}</p>
                      <p className="text-xs text-muted-foreground">📍 {pair.studentLocation}</p>
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Teacher</p>
                    <div>
                      <p className="font-medium">{pair.teacherName}</p>
                      <p className="text-sm text-muted-foreground">{pair.teacherEmail}</p>
                      <p className="text-xs text-muted-foreground">📍 {pair.teacherLocation}</p>
                    </div>
                  </div>

                  {/* Assignment Details */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Assignment</p>
                    <div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Assigned:</span>{" "}
                        <span className="font-medium">
                          {getPairDateFormatted(pair.assignedAt)}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {pair.pairId}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <ChangePairTeacher
                    pairId={pair.pairId}
                    studentId={pair.studentId}
                    currentTeacherId={pair.teacherId}
                    currentTeacherName={pair.teacherName}
                    teachers={teachers}
                  />
                  <DeletePair
                    pairId={pair.pairId}
                    studentId={pair.studentId}
                    studentName={pair.studentName}
                    teacherName={pair.teacherName}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination info */}
        {pairs.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
            Showing {pairs.length} of {totalPairs} assignments
          </div>
        )}
      </CardContent>
    </Card>
  )
}
