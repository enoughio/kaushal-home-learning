import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react'

type PlatformStatsPlaceholder = {
  totalUsers: number
  monthlyGrowth: number
  approvedTeachers: number
  pendingTeachers: number
  totalRevenue: number
  yearlyGrowth: number
  totalStudents: number
}

async function fetchPlatformStats(): Promise<PlatformStatsPlaceholder> {
  // Placeholder data - replace with API call later
  return {
    totalUsers: 12450,
    monthlyGrowth: 4,
    approvedTeachers: 320,
    pendingTeachers: 12,
    totalRevenue: 1250000,
    yearlyGrowth: 18,
    totalStudents: 9800,
  }
}

const OverviewStats = async () => {
  const stats = await fetchPlatformStats()

  return (
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
  )
}

export default OverviewStats