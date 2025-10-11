"use client"

import { useState, useEffect } from "react"
import { TeacherLayout } from "@/components/layout/teacher-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TeacherDataService, type StudentInfo, type PaymentRecord, type TeacherAssignment } from "@/lib/teacher-data"
import { AuthService } from "@/lib/auth"
import { Users, DollarSign, FileText, Calendar, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TeacherDashboard() {
  const [students, setStudents] = useState<StudentInfo[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (!user) return

        const [studentsData, paymentsData, assignmentsData] = await Promise.all([
          TeacherDataService.getMyStudents(user.id),
          TeacherDataService.getPaymentHistory(user.id),
          TeacherDataService.getMyAssignments(user.id),
        ])

        setStudents(studentsData)
        setPayments(paymentsData)
        setAssignments(assignmentsData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const activeStudents = students.filter((s) => s.status === "active")
  const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue")
  const totalEarnings = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const pendingAssignments = assignments.filter((a) => a.status === "submitted")

  if (loading) {
    return (
      <TeacherLayout activeTab="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your students and track your teaching progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">{activeStudents.length}</p>
                </div>
                <Users className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">{pendingAssignments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">₹{pendingPayments.reduce((sum, p) => sum + p.amount, 0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/teacher/assignments")}
              >
                <FileText className="h-6 w-6" />
                <span>Create Assignment</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/teacher/attendance")}
              >
                <Calendar className="h-6 w-6" />
                <span>Mark Attendance</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/teacher/students")}
              >
                <Users className="h-6 w-6" />
                <span>View Students</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/teacher/payments")}
              >
                <DollarSign className="h-6 w-6" />
                <span>Payment History</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Students */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Students</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/teacher/students")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {activeStudents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No active students</p>
              ) : (
                <div className="space-y-3">
                  {activeStudents.slice(0, 3).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.skillsLearning.join(", ")}</p>
                        <p className="text-xs text-muted-foreground">Joined: {student.joinedDate}</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Reviews</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/teacher/assignments")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {pendingAssignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No assignments to review</p>
              ) : (
                <div className="space-y-3">
                  {pendingAssignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.studentName}</p>
                        <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                      </div>
                      <Badge variant="secondary">Review</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/teacher/payments")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No payment records</p>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
                        <DollarSign className="h-5 w-5 text-chart-2" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.subject} • {payment.hoursTeached}h
                        </p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{payment.amount}</p>
                      <Badge
                        variant={
                          payment.status === "paid"
                            ? "default"
                            : payment.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  )
}
