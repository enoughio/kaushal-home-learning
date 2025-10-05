// Example of a server component admin page
// This shows the pattern you'd use in production with server-side auth

import { AdminLayoutServer } from "@/components/layout/AdminLayoutServer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, DollarSign, TrendingUp } from "lucide-react"
// import { requireAuth } from "@/lib/server-auth" // Uncomment in production

// Mock data for demonstration
const mockStats = {
  totalUsers: 1250,
  approvedTeachers: 45,
  totalRevenue: 125000,
  totalStudents: 1000,
  monthlyGrowth: 12,
  yearlyGrowth: 35,
  pendingTeachers: 8,
  totalTeachers: 53,
}

export default async function AdminDashboardServer() {
  // In production, you'd use server-side auth:
  // const user = await requireAuth('admin')

  return (
    <AdminLayoutServer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard (Server)</h1>
          <p className="text-muted-foreground">Server-rendered admin dashboard</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{mockStats.totalUsers}</p>
                  <p className="text-xs text-chart-1">+{mockStats.monthlyGrowth}% this month</p>
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
                  <p className="text-2xl font-bold">{mockStats.approvedTeachers}</p>
                  <p className="text-xs text-chart-2">{mockStats.pendingTeachers} pending approval</p>
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
                  <p className="text-2xl font-bold">₹{mockStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-chart-3">+{mockStats.yearlyGrowth}% this year</p>
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
                  <p className="text-2xl font-bold">{mockStats.totalStudents}</p>
                  <p className="text-xs text-chart-4">Active learners</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example of server-rendered content */}
        <Card>
          <CardHeader>
            <CardTitle>Server-Side Rendering Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Faster initial page load</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Better SEO (though not needed for admin pages)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Server-side data fetching</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Reduced client-side JavaScript</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayoutServer>
  )
}