import React from "react"
import { Card, CardContent } from "../../ui/card"
import { DollarSign, FileText, TrendingUp, Users, AlertTriangle } from "lucide-react"
import myFetch from "@/lib/requestHelper"
import { TeacherStatsResponse } from "@/lib/types"

/**
 * Fetch teacher statistics from API
 */
async function fetchTeacherStats(): Promise<TeacherStatsResponse | null> {
  try {
    const response = await myFetch("/api/teacher/stats")

    if (!response.ok) {
      console.error("Failed to fetch teacher stats:", response.status)
      return null
    }

    const data = await response.json()
    return data?.data || null
  } catch (error) {
    console.error("Error fetching teacher stats:", error)
    return null
  }
}

/**
 * Stats — displays teacher dashboard summary.
 * Server component that fetches real data from API.
 * Shows error state if data cannot be fetched.
 */
export default async function Stats() {
  const stats = await fetchTeacherStats()

  // Error state: Failed to load stats
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Failed to load statistics</p>
                <p className="text-sm text-muted-foreground">Please refresh the page to try again</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Students Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents || 0}</p>
            </div>
            <Users className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      {/* Total Earnings Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">₹{(stats.totalEarnings || 0).toLocaleString("en-IN")}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Reviews Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-bold">{stats.pendingAssignments || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>
  {/* TODO :  Add this */}
      {/* Pending Payments Card - Note: API doesn't return this yet */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold">₹0</p>
            </div>
            <TrendingUp className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
