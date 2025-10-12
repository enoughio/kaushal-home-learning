"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataService, type PlatformStats, type UserManagement, type TeacherApproval } from "@/lib/adminData"
import { Users, UserCheck, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<UserManagement[]>([])
  const [pendingTeachers, setPendingTeachers] = useState<TeacherApproval[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, usersData, teachersData] = await Promise.all([
          AdminDataService.getPlatformStats(),
          AdminDataService.getAllUsers(),
          AdminDataService.getPendingTeachers(),
        ])

        setStats(statsData)
        setRecentUsers(usersData.slice(0, 5))
        setPendingTeachers(teachersData)
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the Kaushaly platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-chart-1">+{stats.monthlyGrowth}% this month</p>
                </div>
                <Users className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                  <p className="text-2xl font-bold">{stats.approvedTeachers}</p>
                  <p className="text-xs text-chart-2">{stats.pendingTeachers} pending approval</p>
                </div>
                <UserCheck className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-chart-3">+{stats.yearlyGrowth}% this year</p>
                </div>
                <DollarSign className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-xs text-chart-4">Active learners</p>
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
                onClick={() => router.push("/admin/approvals")}
              >
                <UserCheck className="h-6 w-6" />
                <span>Review Teachers</span>
                {pendingTeachers.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {pendingTeachers.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/admin/users")}
              >
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/admin/analytics")}
              >
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => router.push("/admin/payments")}
              >
                <DollarSign className="h-6 w-6" />
                <span>Payment Overview</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Teacher Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Pending Teacher Approvals
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin/approvals")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {pendingTeachers.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-chart-2 mx-auto mb-2" />
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTeachers.slice(0, 3).map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{teacher.skillsToTeach.join(", ")}</p>
                        <p className="text-xs text-muted-foreground">Applied: {teacher.appliedDate}</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin/users")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Joined: {user.joinedDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {user.role}
                      </Badge>
                      <br />
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1 mb-2">
                  {Math.round((stats.approvedTeachers / stats.totalTeachers) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Teacher Approval Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2 mb-2">
                  {Math.round((stats.totalStudents / stats.totalUsers) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Student Ratio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3 mb-2">
                  ₹{Math.round(stats.totalRevenue / stats.totalStudents)}
                </div>
                <p className="text-sm text-muted-foreground">Revenue per Student</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
