"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminDataService, type MonthlyData, type PlatformStats } from "@/lib/admin-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, DollarSign, Calendar, BookOpen, Clock, MapPin } from "lucide-react"

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  const [annualData, setAnnualData] = useState<any[]>([])
  const [paymentBreakdown, setPaymentBreakdown] = useState<any[]>([])
  const [subjectDistribution, setSubjectDistribution] = useState<any[]>([])
  const [locationStats, setLocationStats] = useState<any[]>([])
  const [attendanceStats, setAttendanceStats] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [monthlyDataResult, statsResult] = await Promise.all([
          AdminDataService.getMonthlyData(),
          AdminDataService.getPlatformStats(),
        ])
        setMonthlyData(monthlyDataResult)
        setStats(statsResult)

        setAnnualData([
          { year: "2022", revenue: 1200000, students: 450, teachers: 85 },
          { year: "2023", revenue: 2800000, students: 1200, teachers: 180 },
          { year: "2024", revenue: 4500000, students: 2100, teachers: 320 },
          { year: "2025", revenue: 6200000, students: 3200, teachers: 450 },
        ])

        setPaymentBreakdown([
          { type: "Student Fees", amount: 3800000, percentage: 75, color: "#3b82f6" },
          { type: "Teacher Salaries", amount: 1200000, percentage: 25, color: "#ef4444" },
        ])

        setSubjectDistribution([
          { subject: "Mathematics", students: 850, color: "#3b82f6" },
          { subject: "Science", students: 720, color: "#10b981" },
          { subject: "English", students: 650, color: "#f59e0b" },
          { subject: "Hindi", students: 480, color: "#ef4444" },
          { subject: "Social Studies", students: 420, color: "#8b5cf6" },
          { subject: "Computer Science", students: 380, color: "#06b6d4" },
        ])

        setLocationStats([
          { city: "Mumbai", students: 680, teachers: 95 },
          { city: "Delhi", students: 520, teachers: 78 },
          { city: "Bangalore", students: 450, teachers: 65 },
          { city: "Chennai", students: 380, teachers: 52 },
          { city: "Kolkata", students: 320, teachers: 48 },
          { city: "Pune", students: 280, teachers: 42 },
        ])

        setAttendanceStats([
          { month: "Jan", attendance: 92 },
          { month: "Feb", attendance: 89 },
          { month: "Mar", attendance: 94 },
          { month: "Apr", attendance: 87 },
          { month: "May", attendance: 91 },
          { month: "Jun", attendance: 88 },
        ])
      } catch (error) {
        console.error("Failed to load analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <AdminLayout activeTab="analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) return null

  return (
    <AdminLayout activeTab="analytics">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into platform performance and growth</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                  <p className="text-2xl font-bold text-chart-1">+{stats.monthlyGrowth}%</p>
                  <p className="text-xs text-muted-foreground">User acquisition</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Yearly Growth</p>
                  <p className="text-2xl font-bold text-chart-2">+{stats.yearlyGrowth}%</p>
                  <p className="text-xs text-muted-foreground">Platform expansion</p>
                </div>
                <Users className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
                  <p className="text-2xl font-bold text-chart-3">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total platform revenue</p>
                </div>
                <DollarSign className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold text-chart-4">90%</p>
                  <p className="text-xs text-muted-foreground">Student attendance rate</p>
                </div>
                <Clock className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Annual Growth Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Annual Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Annual Revenue Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={annualData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="year" className="text-muted-foreground" />
                    <YAxis
                      className="text-muted-foreground"
                      tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Base Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={annualData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="year" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      name="Students"
                    />
                    <Line
                      type="monotone"
                      dataKey="teachers"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      name="Teachers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Payment Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {paymentBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {paymentBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, ""]}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Subject & Location Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Popular Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis dataKey="subject" type="category" className="text-muted-foreground" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value} students`, "Enrolled"]}
                    />
                    <Bar dataKey="students" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  City-wise Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationStats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="city" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="students" fill="hsl(var(--chart-1))" name="Students" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="teachers" fill="hsl(var(--chart-2))" name="Teachers" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Attendance Analytics</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Monthly Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Attendance"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Existing charts and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Students"
                  />
                  <Line
                    type="monotone"
                    dataKey="teachers"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Teachers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Students</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-1 rounded-full"
                      style={{ width: `${(stats.totalStudents / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stats.totalStudents}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Teachers</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-2 rounded-full"
                      style={{ width: `${(stats.totalTeachers / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stats.totalTeachers}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-2 rounded-full"
                      style={{ width: `${(stats.approvedTeachers / stats.totalTeachers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stats.approvedTeachers}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${(stats.pendingTeachers / stats.totalTeachers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{stats.pendingTeachers}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-1">
                  {Math.round((stats.totalStudents / stats.approvedTeachers) * 10) / 10}
                </p>
                <p className="text-sm text-muted-foreground">Students per Teacher</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-3">
                  ₹{Math.round(stats.totalRevenue / stats.totalStudents)}
                </p>
                <p className="text-sm text-muted-foreground">Revenue per Student</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
