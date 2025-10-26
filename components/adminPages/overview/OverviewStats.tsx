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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/dashboard`);
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    // Fallback to placeholder data in case of error
    return {
      totalUsers: 0,
      monthlyGrowth: 0,
      approvedTeachers: 0,
      pendingTeachers: 0,
      totalRevenue: 0,
      yearlyGrowth: 0,
      totalStudents: 0,
    };
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