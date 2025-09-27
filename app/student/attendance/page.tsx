"use client"

import { useState, useEffect } from "react"
import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MockDataService, type AttendanceRecord } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth"
import { Calendar, Clock, User, CheckCircle, XCircle, Plus } from "lucide-react"

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (user) {
          const data = await MockDataService.getAttendanceRecords(user.id)
          setAttendance(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        }
      } catch (error) {
        console.error("Failed to load attendance:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAttendance()
  }, [])

  const handleMarkAttendance = async () => {
    setMarking(true)
    try {
      const user = AuthService.getCurrentUser()
      if (user) {
        await MockDataService.markAttendance(user.id, "3", "Mathematics") // Mock teacher and subject
        const data = await MockDataService.getAttendanceRecords(user.id)
        setAttendance(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error)
    } finally {
      setMarking(false)
    }
  }

  const presentCount = attendance.filter((record) => record.status === "present").length
  const absentCount = attendance.filter((record) => record.status === "absent").length
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0
  const totalHours = attendance
    .filter((record) => record.status === "present")
    .reduce((sum, record) => sum + record.duration, 0)

  if (loading) {
    return (
      <StudentLayout activeTab="attendance">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading attendance...</p>
          </div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout activeTab="attendance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Track your class attendance and learning hours</p>
          </div>
          <Button onClick={handleMarkAttendance} disabled={marking}>
            <Plus className="mr-2 h-4 w-4" />
            {marking ? "Marking..." : "Mark Today's Attendance"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-chart-1">{attendanceRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-chart-2">{presentCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-chart-3">{Math.round(totalHours / 60)}</p>
                </div>
                <Clock className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records found</p>
                <p className="text-sm text-muted-foreground mt-2">Start marking your attendance to see records here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
                        {record.status === "present" ? (
                          <CheckCircle className="h-5 w-5 text-chart-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{record.subject}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {record.teacherName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {record.date}
                          </div>
                          {record.status === "present" && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {record.duration} mins
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={record.status === "present" ? "default" : "destructive"}>{record.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  )
}
