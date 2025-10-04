"use client"

import { useState, useEffect } from "react"
import { StudentLayout } from "@/components/layout/StudentLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MockDataService, type Assignment, type AttendanceRecord } from "@/lib/mockData"
import { AuthService } from "@/lib/auth"
import { BookOpen, Calendar, FileText, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (!user) return

        const [assignmentsData, attendanceData] = await Promise.all([
          MockDataService.getAssignments(user.id),
          MockDataService.getAttendanceRecords(user.id),
        ])

        setAssignments(assignmentsData)
        setAttendance(attendanceData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const pendingAssignments = assignments.filter((a) => a.status === "pending")
  const recentAttendance = attendance.slice(0, 5)
  const attendanceRate =
    attendance.length > 0
      ? Math.round((attendance.filter((a) => a.status === "present").length / attendance.length) * 100)
      : 0

  if (loading) {
    return (
      <StudentLayout activeTab="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                  <p className="text-2xl font-bold">{pendingAssignments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">{attendanceRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-2xl font-bold">{attendance.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <Users className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/student/teachers")}
              >
                <BookOpen className="h-6 w-6" />
                <span>Find Teachers</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/student/attendance")}
              >
                <Calendar className="h-6 w-6" />
                <span>Mark Attendance</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/student/assignments")}
              >
                <FileText className="h-6 w-6" />
                <span>View Assignments</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Assignments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/student/assignments")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {pendingAssignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending assignments</p>
              ) : (
                <div className="space-y-3">
                  {pendingAssignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                        <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Attendance</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/student/attendance")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentAttendance.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No attendance records</p>
              ) : (
                <div className="space-y-3">
                  {recentAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{record.subject}</p>
                        <p className="text-sm text-muted-foreground">{record.teacherName}</p>
                        <p className="text-xs text-muted-foreground">{record.date}</p>
                      </div>
                      <Badge variant={record.status === "present" ? "default" : "destructive"}>{record.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  )
}
