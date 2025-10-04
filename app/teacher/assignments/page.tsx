"use client"

import { useState, useEffect } from "react"
import { TeacherLayout } from "@/components/layout/TeacherLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TeacherDataService, type TeacherAssignment, type StudentInfo } from "@/lib/teacherData"
import { AuthService } from "@/lib/auth"
import { Plus, FileText, Calendar, User, Star } from "lucide-react"

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([])
  const [students, setStudents] = useState<StudentInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [grading, setGrading] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form states
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    subject: "",
    studentId: "",
    dueDate: "",
  })
  const [gradeForm, setGradeForm] = useState({
    grade: "",
    feedback: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (user) {
          const [assignmentsData, studentsData] = await Promise.all([
            TeacherDataService.getMyAssignments(user.id),
            TeacherDataService.getMyStudents(user.id),
          ])
          setAssignments(assignmentsData)
          setStudents(studentsData.filter((s) => s.status === "active"))
        }
      } catch (error) {
        console.error("Failed to load assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.studentId || !newAssignment.dueDate) return

    setCreating(true)
    try {
      const user = AuthService.getCurrentUser()
      if (user) {
        const student = students.find((s) => s.id === newAssignment.studentId)
        const assignment = await TeacherDataService.createAssignment({
          ...newAssignment,
          studentName: student?.name || "",
          assignedDate: new Date().toISOString().split("T")[0],
        })
        setAssignments((prev) => [assignment, ...prev])
        setNewAssignment({ title: "", description: "", subject: "", studentId: "", dueDate: "" })
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to create assignment:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleGradeAssignment = async (assignmentId: string) => {
    if (!gradeForm.grade) return

    setGrading(assignmentId)
    try {
      await TeacherDataService.gradeAssignment(assignmentId, Number.parseInt(gradeForm.grade), gradeForm.feedback)
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId
            ? {
                ...assignment,
                status: "graded",
                grade: Number.parseInt(gradeForm.grade),
                feedback: gradeForm.feedback,
              }
            : assignment,
        ),
      )
      setGradeForm({ grade: "", feedback: "" })
    } catch (error) {
      console.error("Failed to grade assignment:", error)
    } finally {
      setGrading(null)
    }
  }

  const getStatusColor = (status: TeacherAssignment["status"]) => {
    switch (status) {
      case "assigned":
        return "secondary"
      case "submitted":
        return "default"
      case "graded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const assignedCount = assignments.filter((a) => a.status === "assigned").length
  const submittedCount = assignments.filter((a) => a.status === "submitted").length
  const gradedCount = assignments.filter((a) => a.status === "graded").length

  if (loading) {
    return (
      <TeacherLayout activeTab="assignments">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading assignments...</p>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout activeTab="assignments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">Create and manage student assignments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Assignment title"
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={newAssignment.studentId}
                    onValueChange={(value) => setNewAssignment((prev) => ({ ...prev, studentId: value }))}
                  >
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Subject"
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Assignment description and instructions"
                    className="bg-input"
                  />
                </div>
                <Button onClick={handleCreateAssignment} disabled={creating} className="w-full">
                  {creating ? "Creating..." : "Create Assignment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                  <p className="text-2xl font-bold text-chart-2">{assignedCount}</p>
                </div>
                <FileText className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-chart-1">{submittedCount}</p>
                </div>
                <FileText className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Graded</p>
                  <p className="text-2xl font-bold text-chart-3">{gradedCount}</p>
                </div>
                <Star className="h-8 w-8 text-chart-3" />
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
                <p className="text-muted-foreground">No assignments created yet</p>
                <p className="text-sm text-muted-foreground mt-2">Create your first assignment to get started</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {assignment.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {assignment.studentName}
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

                    {assignment.status === "submitted" && (
                      <div className="space-y-3 border-t border-border pt-4">
                        <div>
                          <p className="font-medium mb-2">Student Submission:</p>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">{assignment.submissionText}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`grade-${assignment.id}`}>Grade (0-100)</Label>
                            <Input
                              id={`grade-${assignment.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={gradeForm.grade}
                              onChange={(e) => setGradeForm((prev) => ({ ...prev, grade: e.target.value }))}
                              placeholder="Enter grade"
                              className="bg-input"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`feedback-${assignment.id}`}>Feedback</Label>
                            <Input
                              id={`feedback-${assignment.id}`}
                              value={gradeForm.feedback}
                              onChange={(e) => setGradeForm((prev) => ({ ...prev, feedback: e.target.value }))}
                              placeholder="Optional feedback"
                              className="bg-input"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => handleGradeAssignment(assignment.id)}
                          disabled={grading === assignment.id || !gradeForm.grade}
                        >
                          {grading === assignment.id ? "Grading..." : "Submit Grade"}
                        </Button>
                      </div>
                    )}

                    {assignment.status === "graded" && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Graded: {assignment.grade}%</span>
                          {assignment.feedback && (
                            <span className="text-muted-foreground ml-2">• {assignment.feedback}</span>
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
    </TeacherLayout>
  )
}
