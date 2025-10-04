"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataService, type TeacherApproval } from "@/lib/adminData"
import { UserCheck, UserX, Phone, MapPin, Calendar, BookOpen, Award, AlertCircle } from "lucide-react"

export default function TeacherApprovalsPage() {
  const [teachers, setTeachers] = useState<TeacherApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await AdminDataService.getPendingTeachers()
        setTeachers(data)
      } catch (error) {
        console.error("Failed to load pending teachers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTeachers()
  }, [])

  const handleApprove = async (teacherId: string) => {
    setProcessing(teacherId)
    try {
      await AdminDataService.approveTeacher(teacherId)
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId))
    } catch (error) {
      console.error("Failed to approve teacher:", error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (teacherId: string) => {
    setProcessing(teacherId)
    try {
      await AdminDataService.rejectTeacher(teacherId)
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId))
    } catch (error) {
      console.error("Failed to reject teacher:", error)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout activeTab="approvals">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading teacher applications...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout activeTab="approvals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Teacher Approvals</h1>
            <p className="text-muted-foreground">Review and approve teacher applications</p>
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{teachers.length}</p>
                <p className="text-muted-foreground">Pending Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <div className="space-y-4">
          {teachers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <UserCheck className="h-16 w-16 text-chart-2 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No pending teacher applications to review</p>
              </CardContent>
            </Card>
          ) : (
            teachers.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{teacher.name}</CardTitle>
                      <p className="text-muted-foreground">{teacher.email}</p>
                    </div>
                    <Badge variant="secondary">Pending Review</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{teacher.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{teacher.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Applied: {teacher.appliedDate}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{teacher.experience} years experience</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>ID: {teacher.idProof}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center mb-3">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Teaching Subjects:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacher.skillsToTeach.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(teacher.id)}
                      disabled={processing === teacher.id}
                      className="bg-transparent text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      {processing === teacher.id ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                      onClick={() => handleApprove(teacher.id)}
                      disabled={processing === teacher.id}
                      className="bg-chart-2 hover:bg-chart-2/90"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      {processing === teacher.id ? "Processing..." : "Approve"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
