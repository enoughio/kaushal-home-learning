"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MockDataService, type Assignment } from "@/lib/mockData"
import { AuthService } from "@/lib/auth"
import { FileText, Calendar, User, Upload, CheckCircle } from "lucide-react"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (user) {
          const data = await MockDataService.getAssignments(user.id)
          setAssignments(data)
        }
      } catch (error) {
        console.error("Failed to load assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAssignments()
  }, [])

  const handleSubmit = async (assignmentId: string) => {
    setSubmitting(assignmentId)
    try {
      await MockDataService.submitAssignment(assignmentId)
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, status: "submitted", submittedAt: new Date().toISOString().split("T")[0] }
            : assignment,
        ),
      )
      setSubmissions((prev) => ({ ...prev, [assignmentId]: "" }))
    } catch (error) {
      console.error("Failed to submit assignment:", error)
    } finally {
      setSubmitting(null)
    }
  }

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "destructive"
      case "submitted":
        return "secondary"
      case "graded":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return <FileText className="h-4 w-4" />
      case "submitted":
        return <Upload className="h-4 w-4" />
      case "graded":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading assignments...</p>
          </div>
        </div>
    )
  }

  const pendingAssignments = assignments.filter((a) => a.status === "pending")
  const submittedAssignments = assignments.filter((a) => a.status === "submitted")
  const gradedAssignments = assignments.filter((a) => a.status === "graded")

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Manage your assignments and submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-destructive">{pendingAssignments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-chart-2">{submittedAssignments.length}</p>
                </div>
                <Upload className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Graded</p>
                  <p className="text-2xl font-bold text-chart-1">{gradedAssignments.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assignments available</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(assignment.status)}
                        {assignment.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {assignment.teacherName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {assignment.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(assignment.status)}>{assignment.status}</Badge>
                      {assignment.grade && <Badge variant="outline">{assignment.grade}%</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Subject: {assignment.subject}</p>
                      <p className="text-muted-foreground mt-1">{assignment.description}</p>
                    </div>

                    {assignment.status === "pending" && (
                      <div className="space-y-3 border-t border-border pt-4">
                        <div>
                          <label className="text-sm font-medium">Your Submission</label>
                          <Textarea
                            placeholder="Write your answer or upload your work..."
                            value={submissions[assignment.id] || ""}
                            onChange={(e) => setSubmissions((prev) => ({ ...prev, [assignment.id]: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <Button
                          onClick={() => handleSubmit(assignment.id)}
                          disabled={submitting === assignment.id || !submissions[assignment.id]?.trim()}
                        >
                          {submitting === assignment.id ? "Submitting..." : "Submit Assignment"}
                        </Button>
                      </div>
                    )}

                    {assignment.status === "submitted" && assignment.submittedAt && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Submitted on {assignment.submittedAt} - Waiting for review
                        </p>
                      </div>
                    )}

                    {assignment.status === "graded" && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Grade: {assignment.grade}%</span>
                          {assignment.submittedAt && (
                            <span className="text-muted-foreground ml-2">(Submitted on {assignment.submittedAt})</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
  )
}
