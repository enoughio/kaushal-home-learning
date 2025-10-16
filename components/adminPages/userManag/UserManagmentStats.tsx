
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

type StatsShape = {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  students: number
  teachers: number
}

async function fetchStats(): Promise<StatsShape> {
  // placeholder - replace with AdminDataService or API call
  return {
    totalUsers: 123,
    activeUsers: 98,
    pendingUsers: 5,
    students: 80,
    teachers: 38,
  }
}

export default async function UserManagmentStats() {
  const stats = await fetchStats()
  const { totalUsers, activeUsers, pendingUsers, students, teachers } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-2">{activeUsers}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">{pendingUsers}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-3">{students}</p>
            <p className="text-sm text-muted-foreground">Students</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-4">{teachers}</p>
            <p className="text-sm text-muted-foreground">Teachers</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}