"use client"

import { useState, useEffect, useMemo } from "react"
import { StudentLayout } from "@/components/layout/student-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MockDataService, type AttendanceRecord } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth"
import { Calendar, Clock, User, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react"

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const presentCount = attendance.filter((record) => record.status === "present").length
  const absentCount = attendance.filter((record) => record.status === "absent").length
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0
  const totalHours = attendance
    .filter((record) => record.status === "present")
    .reduce((sum, record) => sum + record.duration, 0)

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  function fmtISO(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  // Normalize record.date into YYYY-MM-DD keys (handles various formats)
  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceRecord[]>()
    for (const r of attendance) {
      const d = new Date(r.date)
      const key = fmtISO(d)
      const arr = map.get(key) ?? []
      arr.push(r)
      map.set(key, arr)
    }
    return map
  }, [attendance])

  // Build a grid for the current month with optional previous/next month leading/trailing days
  const monthGrid = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startWeekday = firstDay.getDay() // 0=Sun..6=Sat
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: Array<{
      date: Date
      inMonth: boolean
      status: "present" | "absent" | "none"
      duration?: number
      teacherName?: string
      subjects?: string[]
    }> = []

    // Leading blanks from previous month
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(year, month, 0 - (startWeekday - 1 - i))
      cells.push({ date: d, inMonth: false, status: "none" })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      const key = fmtISO(d)
      const recs = attendanceByDate.get(key) ?? []
      let status: "present" | "absent" | "none" = "none"
      let duration = 0
      let teacherName: string | undefined
      const subjects = new Set<string>()
      if (recs.length > 0) {
        // If any present => present, else if any absent => absent
        const anyPresent = recs.some((r) => r.status === "present")
        const anyAbsent = recs.some((r) => r.status === "absent")
        if (anyPresent) status = "present"
        else if (anyAbsent) status = "absent"
        duration = recs.filter((r) => r.status === "present").reduce((s, r) => s + (r.duration || 0), 0)
        teacherName = recs[0]?.teacherName
        recs.forEach((r) => subjects.add(r.subject))
      }
      cells.push({
        date: d,
        inMonth: true,
        status,
        duration,
        teacherName,
        subjects: Array.from(subjects),
      })
    }

    // Trailing blanks to complete full weeks (42 cells max)
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      cells.push({ date: next, inMonth: false, status: "none" })
    }

    // Group into weeks
    const weeks: (typeof cells)[] = []
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7))
    }
    return weeks
  }, [attendanceByDate, currentMonth])

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
            <p className="text-muted-foreground">View teacher-marked attendance on the monthly calendar</p>
          </div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Attendance Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous month"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-muted"
                onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-medium">
                {currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </div>
              <button
                aria-label="Next month"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-muted"
                onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-xs md:text-sm">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-muted-foreground font-medium">
                  {d}
                </div>
              ))}
              {monthGrid.map((week, wi) =>
                week.map((cell, di) => {
                  const isPresent = cell.status === "present" && cell.inMonth
                  const isAbsent = cell.status === "absent" && cell.inMonth
                  const isOtherMonth = !cell.inMonth
                  return (
                    <div
                      key={`${wi}-${di}`}
                      className={[
                        "rounded-md border p-2 min-h-20 md:min-h-24",
                        isOtherMonth ? "opacity-40" : "",
                        isPresent ? "border-chart-2 bg-[color:var(--chart-2)]/10" : "",
                        isAbsent ? "border-destructive bg-destructive/10" : "",
                        !isPresent && !isAbsent && !isOtherMonth ? "bg-muted" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{cell.date.getDate()}</span>
                        {isPresent && <CheckCircle className="h-4 w-4 text-chart-2" />}
                        {isAbsent && <XCircle className="h-4 w-4 text-destructive" />}
                      </div>
                      {cell.inMonth && (isPresent || isAbsent) && (
                        <div className="mt-2 space-y-1">
                          {cell.teacherName && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span className="truncate">{cell.teacherName}</span>
                            </div>
                          )}
                          {isPresent && cell.duration ? (
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>{Math.round((cell.duration || 0) / 60)} hr</span>
                            </div>
                          ) : null}
                          {cell.subjects && cell.subjects.length > 0 ? (
                            <div className="text-xs truncate">{cell.subjects.join(", ")}</div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )
                }),
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded bg-[color:var(--chart-2)]/30 border border-[color:var(--chart-2)]" />
                Present
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded bg-destructive/30 border border-destructive" />
                Absent
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded bg-muted border border-border" />
                No record
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-sm text-muted-foreground mt-2">
                  Teachers mark attendance. Records will appear here once marked.
                </p>
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
