"use client"

import { useState, useEffect } from "react"
import { TeacherLayout } from "@/components/layout/TeacherLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TeacherDataService, type StudentInfo } from "@/lib/teacherData"
import { MockDataService, type AttendanceRecord } from "@/lib/mockData"
import { AuthService } from "@/lib/auth"
import { Calendar, CheckCircle, XCircle, User, Clock } from "lucide-react"

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<StudentInfo[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  // Form state for marking attendance
  const [attendanceForm, setAttendanceForm] = useState({
    subject: "",
    status: "present" as "present" | "absent",
    duration: "60",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = AuthService.getCurrentUser()
        if (user) {
          const studentsData = await TeacherDataService.getMyStudents(user.id)
          setStudents(studentsData.filter((s) => s.status === "active"))
        }
      } catch (error) {
        console.error("Failed to load students:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentAttendance(selectedStudent)
    }
  }, [selectedStudent])

  const loadStudentAttendance = async (studentId: string) => {
    try {
      const records = await MockDataService.getAttendanceRecords(studentId)
      setAttendanceRecords(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error("Failed to load attendance:", error)
    }
  }

  const handleMarkAttendance = async () => {
    if (!selectedStudent || !attendanceForm.subject) return

    setMarking(true)
    try {
      const user = AuthService.getCurrentUser()
      if (user) {
        await TeacherDataService.markStudentAttendance(
          selectedStudent,
          user.id,
          attendanceForm.subject,
          attendanceForm.status,
          Number.parseInt(attendanceForm.duration),
        )
        // Reload attendance records
        await loadStudentAttendance(selectedStudent)
        setAttendanceForm({ subject: "", status: "present", duration: "60" })
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error)
    } finally {
      setMarking(false)
    }
  }

  const selectedStudentData = students.find((s) => s.id === selectedStudent)
  const presentCount = attendanceRecords.filter((r) => r.status === "present").length
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length
  const attendanceRate = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0

  if (loading) {
    return (
      <TeacherLayout activeTab="attendance">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading attendance...</p>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout activeTab="attendance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Student Attendance</h1>
          <p className="text-muted-foreground">Track and manage student attendance records</p>
        </div>

        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="bg-input">
                <SelectValue placeholder="Choose a student to view attendance" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.skillsLearning.join(", ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedStudent && selectedStudentData && (
          <>
            {/* Student Info & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <User className="h-8 w-8 text-chart-1 mx-auto mb-2" />
                    <p className="font-medium">{selectedStudentData.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudentData.skillsLearning.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-2">{attendanceRate}%</p>
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-3">{presentCount}</p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mark Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Mark Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={attendanceForm.subject}
                      onValueChange={(value) => setAttendanceForm((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedStudentData.skillsLearning.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={attendanceForm.status}
                      onValueChange={(value: "present" | "absent") =>
                        setAttendanceForm((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={attendanceForm.duration}
                      onChange={(e) => setAttendanceForm((prev) => ({ ...prev, duration: e.target.value }))}
                      disabled={attendanceForm.status === "absent"}
                      className="bg-input"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleMarkAttendance}
                      disabled={marking || !attendanceForm.subject}
                      className="w-full"
                    >
                      {marking ? "Marking..." : "Mark Attendance"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No attendance records found</p>
                    <p className="text-sm text-muted-foreground mt-2">Start marking attendance to see records here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceRecords.map((record) => (
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
          </>
        )}
      </div>
    </TeacherLayout>
  )
}
